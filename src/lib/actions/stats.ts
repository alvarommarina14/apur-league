'use server';

import { getPlayerStatsByCategory } from '@/lib/services/stats';

interface GetPlayersParams {
    search?: string;
    categoryId: number;
    page: number;
    perPage: number;
}

export async function fetchMorePlayers(params: GetPlayersParams) {
    const players = await getPlayerStatsByCategory(params);
    return players;
}
