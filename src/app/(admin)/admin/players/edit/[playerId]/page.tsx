import { getAllCategories } from '@/lib/services/category';
import { getPlayerById } from '@/lib/services/player';

import PlayerForm from '@/components/players/PlayerForm';
import ErrorMessage from '@/components/ErrorMessage';

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
            <ErrorMessage
                title={'Jugador no encontrado'}
                text={
                    'Lo sentimos, no pudimos encontrar al jugador que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );

    const playerCategories = player.playerCategories.map((cat) => String(cat.categoryId) ?? null);

    return (
        <div className="px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Editar Jugador</h1>
            <p className="text-center text-neutral-500 text-sm mt-2">Completá el formulario para editar un jugador.</p>
            <div className="flex justify-center">
                <div className="mt-6 w-full sm:w-7/10 lg:w-5/10 2xl:w-4/10">
                    <PlayerForm
                        playerId={Number(playerId)}
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
