import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';

import Link from 'next/link';
import Filters from '@/components/Filters';
import PlayersTable from '@/components/players/PlayersTable';

interface PlayersSearchParamsType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc';
        status?: 'activo' | 'inactivo';
        page?: string;
    }>;
}

export default async function AdminPlayersPage({ searchParams }: PlayersSearchParamsType) {
    const { search, filterByCategory, sortOrder = 'asc', status = 'activo', page = '1' } = await searchParams;
    const pageNumber = Number(page) || 1;
    const perPage = 25;
    const isActive = status === 'activo';
    const { players, totalCount } = await getAllPlayers({
        search,
        categoryId: Number(filterByCategory),
        sortOrder,
        isActive,
        page: pageNumber,
        perPage,
    });
    const totalPages = perPage > 0 ? Math.ceil(totalCount / perPage) : 1;
    const categories = await getAllCategories();

    return (
        <div className="px-4 py-8 bg-neutral-50 min-h-[calc(100dvh-4rem)]">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Listado de Jugadores</h1>
                <p className="text-center text-neutral-500 text-sm mt-2">Todas las inscripciones activas de la liga</p>

                <div className="flex flex-col gap-4 lg:flex-row justify-between mt-6">
                    <div className="w-full lg:w-7/10 flex flex-col md:flex-row gap-4">
                        <Filters
                            categories={categories}
                            search={search}
                            selectedCategory={filterByCategory}
                            sortOrder={sortOrder}
                            withSearch
                            searchPlaceholder={'Buscar por nombre y apellido...'}
                            showAllCategory
                            withSort
                            withStatus
                            status={status}
                        />
                    </div>
                    <Link
                        href={`/admin/players/new`}
                        className={`self-end lg:self-center w-fit text-center font-semibold px-6 py-2 rounded-md border bg-apur-green hover:bg-apur-green-hover transition shadow-md text-white cursor-pointer`}
                    >
                        Crear Jugador
                    </Link>
                </div>

                <PlayersTable
                    rows={players}
                    page={pageNumber}
                    totalPages={totalPages}
                    isEditable
                    cardsMobile
                    isActive={isActive}
                />
            </div>
        </div>
    );
}
