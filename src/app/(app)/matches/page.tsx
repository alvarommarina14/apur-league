import {
    getMatchWeekWithMatches,
    getAllMatchWeek,
} from '@/lib/services/matchWeek';
import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';

import { format } from '@formkit/tempo';

import Filters from '@/components/Filters';
import MatchCard from '@/components/matches/MatchCard';

interface Props {
    searchParams: Promise<{
        filterByMatchWeek?: string;
        search?: string;
        filterByCategory?: string;
        filterByClub?: string;
    }>;
}

export default async function MatchesPage({ searchParams }: Props) {
    const { filterByMatchWeek, search, filterByCategory, filterByClub } =
        await searchParams;

    const matchWeeks = await getAllMatchWeek();
    const matchWeekId = filterByMatchWeek
        ? filterByMatchWeek
        : matchWeeks[0].id;
    const searchValue = search ?? undefined;

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId: Number(matchWeekId),
        categoryId: Number(filterByCategory),
        search: searchValue,
        clubId: Number(filterByClub),
    });

    const categories = await getAllCategories();
    const clubs = await getAllClubs();

    if (!selectedMatchWeek) {
        return <p>No se encontró la jornada seleccionada.</p>;
    }

    return (
        <div className="px-4 py-8 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-[85rem] mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-apur-green mb-2">
                        {selectedMatchWeek.name}
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        Cronograma de partidos por día y categoría
                    </p>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <Filters
                        matchWeeks={matchWeeks}
                        categories={categories}
                        clubs={clubs}
                        search={search}
                        searchPlaceholder="Buscar por nombre o apellido..."
                        withSearch={true}
                        selectedCategory={filterByCategory}
                        selectedMatchWeek={String(matchWeekId)}
                        selectedClub={filterByClub}
                        showAllCategory
                        showAllClub
                    />
                </div>

                {selectedMatchWeek.matchDays.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        No hay partidos programados para esta jornada.
                    </p>
                ) : (
                    selectedMatchWeek.matchDays.map((day) => (
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
                                        <MatchCard
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
