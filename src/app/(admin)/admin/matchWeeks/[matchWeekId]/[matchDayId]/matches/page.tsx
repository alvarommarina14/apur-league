import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';

import ToggleMatchViews from './ToggleMatchViews';
import ErrorMessage from '@/components/ErrorMessage';

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
    const { filterByCategory, search, filterByClub } = await searchParams;

    const searchValue = search ?? undefined;

    const selectedMatchWeek = await getMatchWeekWithMatches({
        matchWeekId: Number(matchWeekId),
        matchDayId: Number(matchDayId),
        search: searchValue,
        categoryId: Number(filterByCategory),
        clubId: Number(filterByClub),
    });

    if (!selectedMatchWeek || !selectedMatchWeek.matchDays[0]) {
        return (
            <ErrorMessage
                title={'Fecha no encontrada'}
                text={
                    'Lo sentimos, no pudimos encontrar la fecha que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );
    }

    return (
        <ToggleMatchViews
            selectedMatchWeekId={String(selectedMatchWeek.id)}
            matchDay={selectedMatchWeek.matchDays[0]}
            categories={categories}
            clubs={clubs}
            search={search}
            selectedCategory={filterByCategory}
            selectedClub={filterByClub}
            matchDayId={Number(matchDayId)}
        />
    );
}
