import { Player } from '@/types/player';

import { GetAllPlayers } from '@/lib/services/player/service';
import { GetAllCategories } from '@/lib/services/category/service';
import { filterAndSortPlayers } from '@/lib/helpers';

import Filters from './Filters';
import PlayersTable from './Table';

interface JugadoresSearchParamsType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc';
    }>;
}

export default async function Jugadores({
    searchParams,
}: JugadoresSearchParamsType) {
    const { search, filterByCategory, sortOrder = 'asc' } = await searchParams;
    const players: Player[] = await GetAllPlayers();
    const categories = await GetAllCategories();

    const sortedPlayers = filterAndSortPlayers(players, {
        search,
        filterByCategory,
        sortOrder,
    });

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

                <PlayersTable players={sortedPlayers} />
            </div>
        </div>
    );
}
