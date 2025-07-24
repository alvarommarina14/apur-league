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
import { PlayerCategoryStats } from '@/generated/prisma';

interface GetPlayersParams {
    search?: string;
    categoryId: number;
    page: number;
    perPage: number;
}

interface MatchStats {
    winnerGames: number;
    loserGames: number;
    winnerSets: number;
    loserSets: number;
}

export async function fetchMorePlayers(params: GetPlayersParams) {
    try {
        const players = await getPlayersStatsByCategory(params);
        return players;
    } catch {
        throw new Error('Error al obtener estadisticas');
    }
}

export async function upsertStats(
    winnerById: UpsertStatsType[],
    categoryId: number,
    result: string,
    previousResult?: string | null,
    previousWinnerId?: number
) {
    try {
        const playerIds = winnerById.map((s) => s.playerId);
        const playersStats: PlayerCategoryStats[] = await getPlayerStatsByPlayerIdsAndCategoryId(categoryId, playerIds);

        if (previousResult && previousWinnerId) {
            revertStats(previousResult, winnerById, playersStats, previousWinnerId);
        }

        const matchStatsPerPlayer = getPlayersMatchStats(result);

        const { statsToInsert, statsToUpdate } = prepareStatsOperations(
            winnerById,
            playersStats,
            categoryId,
            matchStatsPerPlayer
        );

        if (statsToInsert.length > 0) {
            await createStatsBulk(statsToInsert);
        }
        if (statsToUpdate.length > 0) {
            await updateStatsBulk(statsToUpdate);
        }
    } catch {
        throw new Error('Error al actualizar estadisticas');
    }
}

function revertStats(
    previousResult: string,
    winnerById: UpsertStatsType[],
    playersStats: PlayerCategoryStats[],
    previousWinnerId: number
) {
    const previousMatchStatsPerPlayer = getPlayersMatchStats(previousResult);
    const { winnerGames, loserGames, winnerSets, loserSets } = previousMatchStatsPerPlayer;
    winnerById.forEach((stat) => {
        const stats = playersStats.find((s) => s.playerId === stat.playerId);
        if (stats) {
            const wasWinner = stats.playerId === previousWinnerId;
            const revertGames = wasWinner ? winnerGames - loserGames : loserGames - winnerGames;
            const revertSets = wasWinner ? winnerSets - loserSets : loserSets - winnerSets;

            stats.points = wasWinner ? stats.points - POINTS_PER_WIN : stats.points - POINTS_PER_LOSS;
            stats.matchesPlayed -= 1;
            stats.matchesWon = wasWinner ? stats.matchesWon - 1 : stats.matchesWon;
            stats.diffGames = stats.diffGames - revertGames;
            stats.diffSets = stats.diffSets - revertSets;
        }
    });
}

function prepareStatsOperations(
    winnerById: UpsertStatsType[],
    playersStats: PlayerCategoryStats[],
    categoryId: number,
    matchStats: MatchStats
) {
    const { winnerGames, loserGames, winnerSets, loserSets } = matchStats;
    const gameDifference = winnerGames - loserGames;
    const setDifference = winnerSets - loserSets;

    const statsToInsert: PlayerCategoryStatsCreateType[] = [];
    const statsToUpdate: PlayerCategoryStatsUpdateType[] = [];

    winnerById.forEach((stat) => {
        const existingStats = playersStats.find((s) => s.playerId === stat.playerId);
        const statsDelta = {
            points: stat.isWinner ? POINTS_PER_WIN : POINTS_PER_LOSS,
            matchesPlayed: 1,
            matchesWon: stat.isWinner ? 1 : 0,
            diffGames: stat.isWinner ? gameDifference : -gameDifference,
            diffSets: stat.isWinner ? setDifference : -setDifference,
        };

        if (existingStats) {
            statsToUpdate.push({
                id: existingStats.id,
                data: {
                    ...existingStats,
                    points: existingStats.points + statsDelta.points,
                    matchesPlayed: existingStats.matchesPlayed + statsDelta.matchesPlayed,
                    matchesWon: existingStats.matchesWon + statsDelta.matchesWon,
                    diffGames: existingStats.diffGames + statsDelta.diffGames,
                    diffSets: existingStats.diffSets + statsDelta.diffSets,
                },
            });
        } else {
            statsToInsert.push({
                playerId: stat.playerId,
                categoryId,
                ...statsDelta,
            });
        }
    });

    return { statsToInsert, statsToUpdate };
}
