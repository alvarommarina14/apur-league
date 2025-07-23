import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';
import { getAllPlayers } from '@/lib/services/player';

import ToggleMatchViews from './ToggleMatchViews';

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

export default async function AdminMatchesPage({ searchParams, params }: AdminMatchesPageType) {
    const categories = await getAllCategories();
    const clubs = await getAllClubs();
    const { matchDayId, matchWeekId } = await params;
    const { filterByCategory = String(categories[0].id), search, filterByClub } = await searchParams;

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
            <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6 bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700 mb-4">Fecha no encontrada</h1>
                <p className="text-gray-500 max-w-md text-center">
                    Lo sentimos, no pudimos encontrar la fecha que buscás. Por favor, verifica el ID o intenta
                    nuevamente más tarde.
                </p>
            </div>
        );
    }

    const { players } = await getAllPlayers({
        categoryId: Number(filterByCategory),
    });

    return (
        <ToggleMatchViews
            selectedMatchWeekId={String(selectedMatchWeek.id)}
            matchDay={selectedMatchWeek.matchDays[0]}
            categories={categories}
            clubs={clubs}
            search={search}
            selectedCategory={filterByCategory}
            selectedClub={filterByClub}
            players={players}
            matchDayId={Number(matchDayId)}
        />
    );
}
