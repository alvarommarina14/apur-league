'use server';

import {
    getPlayersStatsByCategory,
    getPlayerStatsByPlayerIdAndCategoryId,
    createStats,
    updateStats,
} from '@/lib/services/stats';

import { getPlayersMatchStats } from '@/lib/helpers/utils';
import { POINTS_PER_LOSS, POINTS_PER_WIN } from '@/lib/constants';

interface GetPlayersParams {
    search?: string;
    categoryId: number;
    page: number;
    perPage: number;
}

export async function fetchMorePlayers(params: GetPlayersParams) {
    const players = await getPlayersStatsByCategory(params);
    return players;
}

export async function upsertStats(playerId: number, categoryId: number, result: string, isWinner: boolean) {
    const stats = await getPlayerStatsByPlayerIdAndCategoryId(categoryId, playerId);
    const playersMatchStats = getPlayersMatchStats(result);

    const { winnerGames, loserGames, winnerSets, loserSets } = playersMatchStats;
    const gameDifference = isWinner ? winnerGames - loserGames : loserGames - winnerGames;
    const setDifference = isWinner ? winnerSets - loserSets : loserSets - winnerSets;

    const baseStats = {
        points: isWinner ? POINTS_PER_WIN : POINTS_PER_LOSS,
        matchesPlayed: 1,
        matchesWon: isWinner ? 1 : 0,
        diffGames: gameDifference,
        diffSets: setDifference,
    };

    if (stats) {
        return updateStats(stats.id, {
            id: stats.id,
            points: stats.points + baseStats.points,
            matchesPlayed: stats.matchesPlayed + 1,
            matchesWon: stats.matchesWon + baseStats.matchesWon,
            diffGames: stats.diffGames + gameDifference,
            diffSets: stats.diffSets + setDifference,
        });
    }

    return createStats({
        playerId,
        categoryId,
        ...baseStats,
    });
}
