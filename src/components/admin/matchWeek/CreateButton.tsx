'use client';

import { useRouter } from 'next/navigation';

import { createMatchWeekAction } from '@/lib/actions/matchWeek';

export default function CreateButton() {
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createMatchWeekAction();
        router.refresh();
    };
    return (
        <form onSubmit={handleCreate} className="flex justify-center mt-4">
            <button
                type="submit"
                className="cursor-pointer bg-apur-green hover:bg-apur-green-hover text-white font-semibold px-4 py-2 rounded-md transition"
            >
                Crear jornada
            </button>
        </form>
    );
}
