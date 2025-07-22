import { getAllCategories } from '@/lib/services/category';

import PlayerForm from '@/components/players/PlayerForm';

export default async function CreatePlayerPage() {
    const categories = await getAllCategories();

    return (
        <div className="px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Crear Jugador</h1>
            <p className="text-center text-neutral-500 text-sm mt-2">
                Completá el formulario para registrar un nuevo jugador en la liga.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full sm:w-7/10 lg:w-5/10 2xl:w-4/10">
                    <PlayerForm categories={categories} />
                </div>
            </div>
        </div>
    );
}
