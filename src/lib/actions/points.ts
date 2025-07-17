'use server';

import { getPlayerPointsByCategoryv2 } from '@/lib/services/points';

interface GetPlayersParams {
    search?: string;
    categoryId?: number;
    page: number;
    perPage: number;
}

export async function fetchMorePlayers(params: GetPlayersParams) {
    const players = await getPlayerPointsByCategoryv2(params);
    return players;
}
