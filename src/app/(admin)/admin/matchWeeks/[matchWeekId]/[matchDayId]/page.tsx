import { format } from '@formkit/tempo';

import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getMatchWeekWithMatches } from '@/lib/services/matches';

import CreateForm from '@/components/admin/matches/CreateForm';
import MatchCardEditable from '@/components/admin/matches/MatchCardEditable';

interface AdminMatchesPageType {
    searchParams: Promise<{
        filterByCategory?: string;
    }>;
    params: Promise<{
        matchWeekId: string;
        matchDayId: string;
    }>;
}

export default async function AdminMatchesPage({
    searchParams,
    params,
}: AdminMatchesPageType) {
    const categories = await getAllCategories();
    const clubs = await getAllClubs();
    const { filterByCategory = String(categories[0].id) } = await searchParams;
    const { matchDayId, matchWeekId } = await params;

    const { players } = await getAllPlayers({
        categoryId: Number(filterByCategory),
    });

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId: Number(matchWeekId),
        matchDayId: Number(matchDayId),
    });

    return (
        <div className="flex flex-col items-center p-10">
            <div className="w-7/10">
                <CreateForm
                    players={players}
                    categories={categories}
                    clubs={clubs}
                    selectedCategory={filterByCategory}
                    matchDayId={matchDayId}
                />
            </div>
            <div className="w-full">
                {selectedMatchWeek?.matchDays.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        No hay partidos programados para esta jornada.
                    </p>
                ) : (
                    selectedMatchWeek?.matchDays.map((day) => (
                        <section key={day.id} className="mt-10">
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
                                    {day.matches.map((match) => (
                                        <MatchCardEditable
                                            key={match.id}
                                            match={match}
                                        />
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))
                )}
            </div>
        </div>
    );
}
