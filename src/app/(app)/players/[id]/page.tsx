import { format } from '@formkit/tempo';

import { getPlayerById } from '@/lib/services/player';

import CategoryTag from '@/components/CategoryTag';
import ErrorMessage from '@/components/ErrorMessage';

interface ParamsProp {
    params: Promise<{ id: string }>;
}

export default async function PlayerPage({ params }: ParamsProp) {
    const { id } = await params;
    const player = await getPlayerById(Number(id));

    if (!player)
        return (
            <ErrorMessage
                title={'Jugador no encontrado'}
                text={
                    'Lo sentimos, no pudimos encontrar al jugador que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );

    const lastMatch = player.playerMatches[0]?.match;
    const lastMatchDate = lastMatch?.matchDay?.date ? format(new Date(lastMatch.matchDay.date), 'D MMM YYYY') : null;

    return (
        <div className="w-full px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)] flex flex-col items-center">
            <h1 className="text-4xl font-bold text-apur-green mb-2 w-full text-center uppercase">
                {player.firstName} {player.lastName}
            </h1>
            <p
                className={`text-sm mb-6 px-3 py-1 rounded-full ${player.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
                {player.isActive ? 'Activo' : 'Inactivo'}
            </p>

            <section className="mb-10 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Categorías Activas</h2>
                {player.playerCategories.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                        {player.playerCategories.map((cat) => (
                            <CategoryTag key={cat.category.id} category={cat.category.name} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay categorías activas</p>
                )}
            </section>

            <section className="mb-10 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Estadísticas</h2>
                {player.categoryStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {player.categoryStats.map((stat) => (
                            <div key={stat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-apur-green mb-1">{stat.category.name}</h3>
                                <p className="text-sm text-gray-700">Puntos: {stat.points}</p>
                                <p className="text-sm text-gray-700">Partidos Jugados: {stat.matchesPlayed}</p>
                                <p className="text-sm text-gray-700">Partidos Ganados: {stat.matchesWon}</p>
                                <p className="text-sm text-gray-700">Diferencia Sets: {stat.diffSets}</p>
                                <p className="text-sm text-gray-700">Diferencia Games: {stat.diffGames}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay estadísticas disponibles</p>
                )}
            </section>

            <section className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Último Partido</h2>
                {lastMatch ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-700 mb-1">
                            <strong>Categoría:</strong> {lastMatch.category.name}
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                            <strong>Resultado:</strong> {player.playerMatches[0].match.result}
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                            <strong>Fecha:</strong> {lastMatchDate}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Ganador:</strong>{' '}
                            {player.playerMatches[0].winner ? (
                                <span className="text-green-700 font-medium">Sí</span>
                            ) : (
                                <span className="text-red-700 font-medium">No</span>
                            )}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay partidos jugados</p>
                )}
            </section>
        </div>
    );
}
