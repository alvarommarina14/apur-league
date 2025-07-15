import { getMatchWeekWithMatches } from '@/lib/services/matches';
import { format } from '@formkit/tempo';

interface Props {
    searchParams: Promise<{
        matchWeek?: string;
        search?: string;
        category?: string;
    }>;
}

export default async function MatchesPage({ searchParams }: Props) {
    const { matchWeek, search, category } = await searchParams;
    const matchWeekId = matchWeek ? parseInt(matchWeek) : 1;
    const categoryId = category ? parseInt(category) : undefined;
    const searchValue = search ?? undefined;

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId,
        categoryId,
        search: searchValue,
    });

    if (!selectedMatchWeek) {
        return <p>No se encontró la jornada seleccionada.</p>;
    }

    return (
        <div className="px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-apur-green mb-2">
                        {selectedMatchWeek.name}
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        Cronograma de partidos por día y categoría
                    </p>
                </div>

                {selectedMatchWeek.matchDays.map((day) => (
                    <section key={day.id} className="mb-10">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                <time
                                    dateTime={format(
                                        day.date,
                                        'DD/MM/YYYY',
                                        'es'
                                    )}
                                >
                                    {format(day.date, 'MMMM D, YYYY', 'es')}
                                </time>
                            </h2>
                        </div>

                        {day.matches.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No hay partidos en este día.
                            </p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {day.matches.map((match) => {
                                    const team1 = match.playerMatches
                                        .filter((pm) => pm.team === 'EQUIPO_1')
                                        .map(
                                            (pm) =>
                                                `${pm.player.firstName} ${pm.player.lastName}`
                                        );

                                    const team2 = match.playerMatches
                                        .filter((pm) => pm.team === 'EQUIPO_2')
                                        .map(
                                            (pm) =>
                                                `${pm.player.firstName} ${pm.player.lastName}`
                                        );

                                    const winners = match.playerMatches
                                        .filter((pm) => pm.winner)
                                        .map(
                                            (pm) =>
                                                `${pm.player.firstName} ${pm.player.lastName}`
                                        );

                                    return (
                                        <li key={match.id}>
                                            <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 h-full">
                                                <p className="text-lg text-neutral-900 font-semibold mb-2">
                                                    {team1.join(' / ')}{' '}
                                                    <span>vs</span>{' '}
                                                    {team2.join(' / ')}
                                                </p>

                                                <p className="text-sm text-gray-600 mb-1">
                                                    {format({
                                                        date: match.hour,
                                                        format: {
                                                            time: 'short',
                                                        },
                                                        tz: 'UTC',
                                                    })}
                                                    - {match.court} -{' '}
                                                    {match.type}
                                                </p>

                                                <p className="inline-block text-xs font-medium px-3 py-1 mt-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 w-max mb-3">
                                                    {match.category?.name}
                                                </p>

                                                <div className="mt-auto -mx-5 pt-2 border-t border-gray-200 px-5">
                                                    <p className="text-green-700 font-semibold text-sm">
                                                        Resultado:{' '}
                                                        {match.result}
                                                    </p>
                                                    {winners.length > 0 && (
                                                        <p className="text-xs text-green-700 mt-1">
                                                            {winners.length ===
                                                            1
                                                                ? 'Ganador: '
                                                                : 'Ganadores: '}
                                                            {winners.join(
                                                                ' y '
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </article>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
