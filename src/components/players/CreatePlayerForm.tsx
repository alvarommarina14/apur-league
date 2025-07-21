'use client';

import { useState, useMemo } from 'react';

import { OptionType } from '@/types/forms';
import { CategoryType } from '@/types/category';
import { mapOptions } from '@/lib/helpers/utils';

import CustomSelect from '@/components/CustomSelect';

type Props = {
    categories: CategoryType[];
};

export default function CreatePlayerForm({ categories }: Props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);

    const categoryOptions = useMemo(
        () =>
            mapOptions(
                categories,
                (cat) => String(cat.id),
                (cat) => cat.name
            ),
        [categories]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            categoryIds: selectedCategories.map((cat) => cat.value),
        };

        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-xl shadow-md">
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-apur-green focus:border-apur-green"
                />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-apur-green focus:border-apur-green"
                />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                <CustomSelect
                    value={selectedCategories}
                    options={categoryOptions}
                    onChange={(newValue) => {
                        const selected = Array.isArray(newValue) ? newValue : newValue ? [newValue] : [];
                        setSelectedCategories(selected);
                    }}
                    instanceId="player-categories"
                    isMulti
                    placeholder="Selecciona una o más categorías"
                />
            </div>

            <div className="mt-8 flex justify-end w-full">
                <button
                    type="submit"
                    // disabled={!isFormValid}
                    className={`font-semibold px-6 py-2 rounded border transition shadow-md border-apur-green bg-apur-green text-white cursor-pointer hover:bg-apur-green-hover hover:border-apur-green-hover`}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
