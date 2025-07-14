import { GetAllPlayers } from '@/lib/services/player/service';
import { GetAllCategories } from '@/lib/services/category/service';

import Filters from './Filters';
import PlayersTable from './Table';

interface JugadoresSearchParamsType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc';
        page?: string;
    }>;
}

export default async function Jugadores({
    searchParams,
}: JugadoresSearchParamsType) {
    const {
        search,
        filterByCategory,
        sortOrder = 'asc',
        page = '1',
    } = await searchParams;
    const pageNumber = Number(page) || 1;
    const perPage = 25;
    const { players, totalCount } = await GetAllPlayers({
        search,
        filterByCategory,
        sortOrder,
        page: pageNumber,
        perPage,
    });
    const totalPages = perPage > 0 ? Math.ceil(totalCount / perPage) : 1;

    const categories = await GetAllCategories();

    return (
        <div className="px-4 py-12 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">
                    Listado de Jugadores
                </h1>
                <p className="text-center text-neutral-500 text-sm mt-2">
                    Todas las inscripciones activas de la liga
                </p>

                <Filters
                    categories={categories}
                    search={search}
                    selectedCategory={filterByCategory}
                    sortOrder={sortOrder}
                />

                <PlayersTable
                    rows={players}
                    page={pageNumber}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}
