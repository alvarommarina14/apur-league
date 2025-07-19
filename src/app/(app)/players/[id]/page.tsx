import { format } from '@formkit/tempo';

import { getPlayerById } from '@/lib/services/player';

interface ParamsProp {
    params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: ParamsProp) {
    const { id } = await params;
    const player = await getPlayerById(Number(id));

    if (!player)
        return (
            <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700 mb-4">
                    Jugador no encontrado
                </h1>
                <p className="text-gray-500 max-w-md text-center">
                    Lo sentimos, no pudimos encontrar al jugador que buscás. Por
                    favor, verifica el ID o intenta nuevamente más tarde.
                </p>
            </div>
        );

    return (
        <div className="w-full px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)] flex flex-col items-center">
            <h1 className="text-4xl font-bold text-apur-green mb-4 truncate">
                {player.firstName} {player.lastName}
            </h1>
            <p className="text-gray-600 mb-6">
                Fecha de nacimiento:{' '}
                <span className="font-semibold text-gray-900">
                    {format(player.dateOfBirth, 'DD-MM-YYYY', 'es')}
                </span>
            </p>
        </div>
    );
}
