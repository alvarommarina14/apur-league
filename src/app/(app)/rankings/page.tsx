import Filters from './Filters';
import { getAllCategories } from '@/lib/services/category';
import {
    getPlayerStatsByCategory,
    countPlayersByFilters,
} from '@/lib/services/stats';
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
    const categories = await getAllCategories();

    const catId = categoryId || categories[0].id;

    const initialPlayers = await getPlayerStatsByCategory({
        search,
        categoryId: catId,
        page: initialPage,
        perPage,
    });

    const totalCount = await countPlayersByFilters(catId, search);

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
                    categoryId={Number(categoryId)}
                />
                <RankingList
                    initialPlayers={initialPlayers}
                    totalCount={totalCount}
                    search={search}
                    categoryId={catId}
                    perPage={perPage}
                />
            </div>
        </div>
    );
}
