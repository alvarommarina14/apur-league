'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LoaderCircle } from 'lucide-react';

import { OptionType } from '@/types/forms';
import { CategoryType } from '@/types/category';
import { mapOptions } from '@/lib/helpers/utils';
import { showErrorToast, showSuccessToast } from '@/components/Toast';

import { updatePlayerDataAction, createPlayerAction } from '@/lib/actions/players';

import CustomSelect from '@/components/CustomSelect';

type Props = {
    playerId?: number;
    categories: CategoryType[];
    selectedFirstName?: string;
    selectedLastName?: string;
    preSelectedCategories?: string[];
    mode?: 'create' | 'edit';
};

export default function PlayerForm({
    playerId,
    categories,
    selectedFirstName,
    selectedLastName,
    preSelectedCategories,
    mode = 'create',
}: Props) {
    const router = useRouter();
    const [firstName, setFirstName] = useState(selectedFirstName || '');
    const [lastName, setLastName] = useState(selectedLastName || '');
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);

    const [errors, setErrors] = useState({ firstName: '', lastName: '', categories: '' });
    const [touched, setTouched] = useState({ firstName: false, lastName: false, categories: false });

    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsloading] = useState(false);

    const categoryOptions = useMemo(
        () =>
            mapOptions(
                categories,
                (cat) => String(cat.id),
                (cat) => cat.name
            ),
        [categories]
    );

    useEffect(() => {
        if (preSelectedCategories && categoryOptions.length > 0) {
            const selected = categoryOptions.filter((opt) => preSelectedCategories.includes(opt.value));
            setSelectedCategories(selected);
        }
    }, [preSelectedCategories, categoryOptions]);

    useEffect(() => {
        const newErrors = {
            firstName: firstName.trim().length < 3 ? 'Debe tener al menos 3 caracteres' : '',
            lastName: lastName.trim().length < 3 ? 'Debe tener al menos 3 caracteres' : '',
            categories: selectedCategories.length === 0 ? 'Debe seleccionar al menos una categoría' : '',
        };

        setErrors(newErrors);
        setIsFormValid(!Object.values(newErrors).some((msg) => msg !== ''));
    }, [firstName, lastName, selectedCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsloading(true);

        if (!isFormValid) {
            showErrorToast('Error al enviar el formulario');
            return;
        }

        const data = {
            firstName,
            lastName,
            categoryIds: selectedCategories.map((cat) => Number(cat.value)),
        };

        try {
            if (mode === 'edit' && playerId) {
                await updatePlayerDataAction(playerId, data);
                showSuccessToast('Jugador actualizado con exito');
                router.push('/admin/players');
            } else {
                await createPlayerAction(data);
                showSuccessToast('Jugador creado con exito');
                router.push('/admin/players');
            }
        } catch {
            showErrorToast('Error al enviar el formulario, intente nuevamente');
        } finally {
            setIsloading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-xl shadow-md">
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
                    className={`w-full text-gray-900 px-4 py-2 rounded-md border ${
                        errors.firstName && touched.firstName
                            ? 'border-red-700 bg-red-50 focus:ring-red-700 focus:border-red-700'
                            : 'border-gray-300 bg-white focus:ring-apur-green focus:border-apur-green'
                    } focus:outline-none focus:ring-1`}
                />
                {errors.firstName && touched.firstName && (
                    <p className="text-sm text-red-700 mt-1">{errors.firstName}</p>
                )}
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                    className={`w-full text-gray-900 px-4 py-2 rounded-md border ${
                        errors.lastName && touched.lastName
                            ? 'border-red-700 bg-red-50 focus:ring-red-700 focus:border-red-700'
                            : 'border-gray-300 bg-white focus:ring-apur-green focus:border-apur-green'
                    } focus:outline-none focus:ring-1`}
                />
                {errors.lastName && touched.lastName && <p className="text-sm text-red-700 mt-1">{errors.lastName}</p>}
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                <CustomSelect
                    value={selectedCategories}
                    options={categoryOptions}
                    onChange={(newValue) => {
                        const selected = Array.isArray(newValue) ? newValue : newValue ? [newValue] : [];
                        setSelectedCategories(selected);
                        setTouched((prev) => ({ ...prev, categories: true }));
                    }}
                    instanceId="player-categories"
                    isMulti
                    placeholder="Selecciona una o más categorías"
                    isError={!!errors.categories && touched.categories}
                />
                {errors.categories && touched.categories && (
                    <p className="text-sm text-red-700 mt-1">{errors.categories}</p>
                )}
            </div>

            <div className="mt-8 flex justify-end w-full">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`font-semibold px-6 py-2 rounded border transition shadow-md bg-apur-green text-white ${
                        isFormValid && !isLoading
                            ? 'hover:bg-apur-green-hover cursor-pointer'
                            : 'opacity-30 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <LoaderCircle size={24} className="animate-spin" />
                    ) : mode === 'edit' ? (
                        'Actualizar'
                    ) : (
                        'Guardar'
                    )}
                </button>
            </div>
        </form>
    );
}
