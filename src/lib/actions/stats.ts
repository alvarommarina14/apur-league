'use server';

import {
    getPlayersStatsByCategory,
    getPlayerStatsByPlayerIdsAndCategoryId,
    createStatsBulk,
    updateStatsBulk,
} from '@/lib/services/stats';

import { getPlayersMatchStats } from '@/lib/helpers/utils';
import { POINTS_PER_LOSS, POINTS_PER_WIN } from '@/lib/constants';
import { UpsertStatsType, PlayerCategoryStatsCreateType, PlayerCategoryStatsUpdateType } from '@/types/stats';

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

export async function upsertStats(stats: UpsertStatsType[], categoryId: number, result: string) {
    const statsToInsert: PlayerCategoryStatsCreateType[] = [];
    const statsToUpdate: PlayerCategoryStatsUpdateType[] = [];
    const playerIds = stats.map((s) => s.playerId);
    const playersStats = await getPlayerStatsByPlayerIdsAndCategoryId(categoryId, playerIds);
    const matchStatsPerPlayer = getPlayersMatchStats(result);

    const { winnerGames, loserGames, winnerSets, loserSets } = matchStatsPerPlayer;
    stats.map((stat) => {
        const gameDifference = winnerGames - loserGames;
        const setDifference = winnerSets - loserSets;
        const stats = playersStats.find((s) => s.playerId === stat.playerId);
        if (stats) {
            statsToUpdate.push({
                id: stats.id,
                data: {
                    ...stats,
                    points: stats.points + (stat.isWinner ? POINTS_PER_WIN : POINTS_PER_LOSS),
                    matchesPlayed: stats.matchesPlayed + 1,
                    matchesWon: stats.matchesWon + (stat.isWinner ? 1 : 0),
                    diffGames: stats.diffGames + (stat.isWinner ? gameDifference : -gameDifference),
                    diffSets: stats.diffSets + (stat.isWinner ? setDifference : -setDifference),
                },
            });
        } else {
            statsToInsert.push({
                playerId: stat.playerId,
                categoryId,
                points: stat.isWinner ? POINTS_PER_WIN : POINTS_PER_LOSS,
                matchesPlayed: 1,
                matchesWon: stat.isWinner ? 1 : 0,
                diffGames: stat.isWinner ? gameDifference : -gameDifference,
                diffSets: stat.isWinner ? setDifference : -setDifference,
            });
        }
    });
    if (statsToInsert.length > 0) {
        await createStatsBulk(statsToInsert);
    }
    if (statsToUpdate.length > 0) {
        await updateStatsBulk(statsToUpdate);
    }
}
