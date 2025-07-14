import { Player } from '@/types/player';

export function sortByKey<T>(
    array: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return order === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return order === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
    });
}

export function filterAndSortPlayers(
    players: Player[],
    {
        search,
        filterByCategory,
        sortOrder = 'asc',
    }: {
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc';
    }
) {
    let filtered = players;

    if (filterByCategory) {
        filtered = filtered.filter((player) =>
            player.playerCategories.some(
                (pc) => pc.category.name === filterByCategory
            )
        );
    }

    if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
            (player) =>
                player.firstName.toLowerCase().includes(lowerSearch) ||
                player.lastName.toLowerCase().includes(lowerSearch)
        );
    }

    return sortByKey(filtered, 'lastName', sortOrder);
}
