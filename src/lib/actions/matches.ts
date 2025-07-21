'use server';
import {
    MatchCreateInputType,
    MatchUpdateInputType,
    MatchUpdateInputWithIdType,
    MatchUpdateWithPlayerMatchesType,
} from '@/types/matches';
import {
    updateMatchBulkService,
    createMatchBulkService,
    createMatchService,
    deleteMatchBulkService,
    updateMatchService,
    deleteMatchService,
} from '@/lib/services/matches';

import { upsertStats } from '@/lib/actions/stats';
import { UpsertStatsType } from '@/types/stats';

export async function createMatch(data: MatchCreateInputType) {
    return await createMatchService(data);
}

export async function createMatchBulk(data: MatchCreateInputType[]) {
    return await createMatchBulkService(data);
}

export async function updateMatchResult(
    id: number,
    data: MatchUpdateWithPlayerMatchesType,
    stats: UpsertStatsType[] = [],
    categoryId: number
) {
    try {
        const match: MatchUpdateInputType = {
            result: data.result,
            playerMatches: {
                update: [
                    ...data.playerMatches!.map((pm) => ({
                        where: {
                            playerId_matchId: {
                                matchId: id,
                                playerId: pm.playerId,
                            },
                        },
                        data: {
                            winner: pm.winner,
                        },
                    })),
                ],
            },
        };
        const updatedMatch = await updateMatchService(Number(id), match);
        await upsertStats(stats, categoryId, data.result ?? '');
        return updatedMatch;
    } catch (error) {
        throw new Error('Failed to update match result ' + error);
    }
}

export async function updateMatchBulk(data: MatchUpdateInputWithIdType[]) {
    return await updateMatchBulkService(data);
}

export async function deleteMatch(id: number) {
    return await deleteMatchService(Number(id));
}

export async function deleteMatchBulk(ids: number[]) {
    return await deleteMatchBulkService(ids);
}
