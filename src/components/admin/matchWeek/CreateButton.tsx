'use client';

import { useRouter } from 'next/navigation';

import { createMatchWeekAction } from '@/lib/actions/matchWeek';

import { showErrorToast, showSuccessToast } from '@/components/Toast';

export default function CreateButton() {
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = await createMatchWeekAction();
            if (result.success) {
                showSuccessToast('Fecha creada con exito');
            } else {
                showErrorToast(result.response!);
            }
            router.refresh();
        } catch {
            showErrorToast('No se pudo cargar la fecha');
        }
    };

    return (
        <form onSubmit={handleCreate} className="flex justify-center mt-4">
            <button
                type="submit"
                className="cursor-pointer bg-apur-green hover:bg-apur-green-hover text-white font-semibold px-4 py-2 rounded-md transition"
            >
                Crear fecha
            </button>
        </form>
    );
}
