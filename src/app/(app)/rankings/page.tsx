import { getPlayersStatsByCategory, countPlayersByFilters } from '@/lib/services/stats';

import { getAllCategories } from '@/lib/services/category';

import Filters from '@/components/Filters';

import { RankingList } from '@/components/rankings/RankingList';

interface CategoryPlayersSearchParamsType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        page?: string;
    }>;
}

export default async function RankingsPage({ searchParams }: CategoryPlayersSearchParamsType) {
    const { search, filterByCategory } = await searchParams;
    const initialPage = 1;
    const perPage = 15;
    const categories = await getAllCategories();

    const catId = filterByCategory || categories[0].id;

    const initialPlayers = await getPlayersStatsByCategory({
        search,
        categoryId: Number(catId),
        page: initialPage,
        perPage,
    });

    const totalCount = await countPlayersByFilters(Number(catId), search);

    return (
        <div className="px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Ranking actual</h1>
                <p className="text-center text-neutral-500 text-sm mt-2">
                    Lista de jugadores ordenada por puntos obtenidos al dia de la fecha
                </p>
                <div className="flex justify-center mt-6">
                    <div className="w-full lg:w-7/10 flex flex-col md:flex-row gap-4">
                        <Filters
                            categories={categories}
                            search={search}
                            searchPlaceholder="Buscar por nombre o apellido..."
                            withSearch={true}
                            selectedCategory={String(catId)}
                        />
                    </div>
                </div>
                <RankingList
                    initialPlayers={initialPlayers}
                    totalCount={totalCount}
                    search={search}
                    categoryId={Number(catId)}
                    perPage={perPage}
                />
            </div>
        </div>
    );
}
