import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';

import Filters from '@/components/Filters';
import PlayersTable from './Table';

interface PLayersSearchParamsType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc';
        page?: string;
    }>;
}

export default async function PlayersPage({
    searchParams,
}: PLayersSearchParamsType) {
    const {
        search,
        filterByCategory,
        sortOrder = 'asc',
        page = '1',
    } = await searchParams;
    const pageNumber = Number(page) || 1;
    const perPage = 25;
    const { players, totalCount } = await getAllPlayers({
        search,
        categoryId: Number(filterByCategory),
        sortOrder,
        page: pageNumber,
        perPage,
    });
    const totalPages = perPage > 0 ? Math.ceil(totalCount / perPage) : 1;
    const categories = await getAllCategories();
    const sortOrderOptions = [
        { value: 'asc', label: 'Ordenar: A-Z' },
        { value: 'desc', label: 'Ordenar: Z-A' },
    ];

    return (
        <div className="px-4 py-8 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">
                    Listado de Jugadores
                </h1>
                <p className="text-center text-neutral-500 text-sm mt-2">
                    Todas las inscripciones activas de la liga
                </p>

                <div className="flex justify-center mt-6">
                    <div className="w-full lg:w-7/10 flex flex-col md:flex-row gap-4">
                        <Filters
                            categories={categories}
                            search={search}
                            selectedCategory={filterByCategory}
                            sortOrder={sortOrder}
                            sortOrderOptions={sortOrderOptions}
                            withSearch
                            searchPlaceholder={
                                'Buscar por nombre y apellido...'
                            }
                            showAllCategory
                            withSort
                        />
                    </div>
                </div>

                <PlayersTable
                    rows={players}
                    page={pageNumber}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}
