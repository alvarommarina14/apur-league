import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';

import MatchesToggle from './MatchesToggle';

interface AdminMatchesPageType {
    searchParams: Promise<{
        filterByCategory?: string;
        search?: string;
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
    const { filterByCategory = String(categories[0].id), search } =
        await searchParams;
    const { matchDayId, matchWeekId } = await params;

    const searchValue = search ?? undefined;

    const { players } = await getAllPlayers({
        categoryId: Number(filterByCategory),
    });

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId: Number(matchWeekId),
        matchDayId: Number(matchDayId),
        search: searchValue,
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
            <MatchesToggle
                players={players}
                categories={categories}
                clubs={clubs}
                selectedCategory={filterByCategory}
                selectedMatchWeek={String(selectedMatchWeek.id)}
                selectedMatchDay={selectedMatchWeek.matchDays[0]}
                search={search}
            />
        </div>
    );
}
