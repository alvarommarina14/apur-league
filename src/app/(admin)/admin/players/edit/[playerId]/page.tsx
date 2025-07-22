import { getAllCategories } from '@/lib/services/category';
import { getPlayerById } from '@/lib/services/player';

import PlayerForm from '@/components/players/PlayerForm';

interface ParamsType {
    params: Promise<{
        playerId: string;
    }>;
}

export default async function CreatePlayerPage({ params }: ParamsType) {
    const { playerId } = await params;
    const categories = await getAllCategories();
    const player = await getPlayerById(Number(playerId));

    if (!player)
        return (
            <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700 mb-4">Jugador no encontrado</h1>
                <p className="text-gray-500 max-w-md text-center">
                    Lo sentimos, no pudimos encontrar al jugador que buscás. Por favor, verifica el ID o intenta
                    nuevamente más tarde.
                </p>
            </div>
        );

    const playerCategories = player.playerCategories.map((cat) => String(cat.categoryId) ?? null);

    return (
        <div className="px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Editar Jugador</h1>
            <p className="text-center text-neutral-500 text-sm mt-2">Completá el formulario para editar un jugador.</p>
            <div className="flex justify-center">
                <div className="mt-6 w-full sm:w-7/10 lg:w-5/10 2xl:w-4/10">
                    <PlayerForm
                        categories={categories}
                        preSelectedCategories={playerCategories}
                        selectedFirstName={player.firstName}
                        selectedLastName={player.lastName}
                        mode="edit"
                    />
                </div>
            </div>
        </div>
    );
}
