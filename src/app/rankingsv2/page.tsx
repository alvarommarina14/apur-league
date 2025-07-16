import Filters from './Filters';
import { getAllCategories } from '@/lib/services/category';
import { getPlayerPointsByCategoryv2 } from '@/lib/services/points';

import { RankingList } from './RankingList';

interface CategoryPlayersSearchParamsType {
    searchParams: Promise<{
        search?: string;
        categoryId?: number;
        page?: string;
    }>;
}

export default async function RankingsPage({
    searchParams,
}: CategoryPlayersSearchParamsType) {
    const { search, categoryId } = await searchParams;

    const initialPage = 1;
    const perPage = 15;

    const { players: initialPlayers, totalCount: initialTotalCount } =
        await getPlayerPointsByCategoryv2({
            search,
            categoryId,
            page: initialPage,
            perPage,
        });

    const categories = await getAllCategories();

    return (
        <div className="px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">
                    Ranking actual
                </h1>
                <p className="text-center text-neutral-500 text-sm mt-2">
                    Lista de jugadores ordenada por puntos obtenidos al dia de
                    la fecha
                </p>
                <Filters
                    categories={categories}
                    search={search}
                    categoryId={categoryId}
                />
                <RankingList
                    initialPlayers={initialPlayers}
                    initialTotalCount={initialTotalCount}
                    search={search}
                    categoryId={categoryId}
                    perPage={perPage}
                />
            </div>
        </div>
    );
}
