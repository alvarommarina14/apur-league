import { format } from '@formkit/tempo';

import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';

import Link from 'next/link';

import MatchCardEditable from '@/components/admin/matches/MatchCardEditable';
import Filters from '@/components/Filters';

interface AdminMatchesPageType {
    searchParams: Promise<{
        filterByCategory?: string;
        search?: string;
        filterByClub: string;
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
    const { matchDayId, matchWeekId } = await params;
    const { filterByCategory, search, filterByClub } = await searchParams;

    const searchValue = search ?? undefined;

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId: Number(matchWeekId),
        matchDayId: Number(matchDayId),
        search: searchValue,
        categoryId: Number(filterByCategory),
        clubId: Number(filterByClub),
    });

    if (!selectedMatchWeek) {
        return (
            <div className="p-6">
                <p className="text-center text-gray-500">
                    No se encontró la fecha seleccionada.
                </p>
            </div>
        );
    }

    return (
        <div className="md:p-6">
            <div className="flex justify-center gap-4 mb-8">
                <span
                    className={`cursor-default font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md bg-apur-green text-white`}
                >
                    Partidos
                </span>
                <Link
                    href={`/admin/matchWeeks/${matchWeekId}/${matchDayId}/matches/new`}
                    className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md bg-white text-apur-green cursor-pointer`}
                >
                    Formulario
                </Link>
            </div>
            <section>
                <div className="mb-10 lg:mb-4 flex flex-col lg:flex-row justify-between lg:items-center">
                    <h2 className="mb-4 lg:mb-0 text-center lg:text-left text-xl font-semibold text-neutral-700">
                        <time
                            dateTime={format(
                                selectedMatchWeek.matchDays[0].date,
                                'DD/MM/YYYY',
                                'es'
                            )}
                        >
                            {format(
                                selectedMatchWeek.matchDays[0].date,
                                'MMMM D, YYYY',
                                'es'
                            )}
                        </time>
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Filters
                            categories={categories}
                            clubs={clubs}
                            search={search}
                            searchPlaceholder="Buscar por nombre o apellido..."
                            withSearch={true}
                            selectedCategory={filterByCategory}
                            selectedMatchWeek={String(selectedMatchWeek.id)}
                            selectedClub={filterByClub}
                            showAllCategory
                            showAllClub
                        />
                    </div>
                </div>

                {selectedMatchWeek.matchDays[0].matches.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No hay partidos en este día.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
                        {selectedMatchWeek.matchDays[0].matches.map((match) => (
                            <MatchCardEditable key={match.id} match={match} />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
