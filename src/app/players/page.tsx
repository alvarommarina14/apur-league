import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';

import Filters from './Filters';
import PlayersTable from './Table';

interface JugadoresSearchParamsType {
    searchParams: Promise<{ search?: string; filterByCategory?: string }>;
}

export default async function Jugadores({
    searchParams,
}: JugadoresSearchParamsType) {
    const { search, filterByCategory } = await searchParams;
    const players = await getAllPlayers();
    const categories = await getAllCategories();

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
                />

                <PlayersTable players={players} />
            </div>
        </div>
    );
}
