'use client';

import { useRouter } from 'next/navigation';

import { createMatchWeekAction } from '@/lib/actions/matchWeek';

import { showErrorToast, showSuccessToast } from '@/components/Toast';

export default function CreateButton() {
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await createMatchWeekAction();
            showSuccessToast('Fecha creada con exito');
            router.refresh();
        } catch (error) {
            showErrorToast(String(error));
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
