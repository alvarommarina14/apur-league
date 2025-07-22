'use server';
import {
    MatchCreateInputType,
    MatchUpdateInputType,
    MatchUpdateInputWithIdType,
    MatchUpdateWithPlayerMatchesType,
} from '@/types/matches';
import {
    updateMatchBulk,
    createMatchBulk,
    createMatch,
    deleteMatchBulk,
    updateMatch,
    deleteMatch,
    getMatchByCourtAndHour,
    getMatchByPlayerIdAndCategoryAndDay,
    getMatchesByHourAndPlayerId,
    getMatchesByPlayerIdsAndCategory,
} from '@/lib/services/matches';

import { upsertStats } from '@/lib/actions/stats';
import { UpsertStatsType } from '@/types/stats';
import { ValidateMatchType } from '@/types/matches';
import { createPlayerMatch } from '@/lib/services/playerMatch';
import { Team } from '@/generated/prisma';

export async function createMatchAction(data: MatchCreateInputType, team1Ids: number[], team2Ids: number[]) {
    try {
        const teamsWithPlayerIds = [
            ...team1Ids.map((playerId) => ({
                playerIds: [playerId],
                team: Team.EQUIPO_1,
            })),
            ...team2Ids.map((playerId) => ({
                playerIds: [playerId],
                team: Team.EQUIPO_2,
            })),
        ];
        await validateMatchAction({
            ...data,
            teamsWithPlayerIds,
        });
        const match = await createMatch(data);
        await createPlayerMatch(match.id, teamsWithPlayerIds);
        return match;
    } catch (error) {
        throw new Error('Failed to create match ' + error);
    }
}

export async function createMatchBulkAction(data: MatchCreateInputType[]) {
    return await createMatchBulk(data);
}

export async function updateMatchResultAction(
    id: number,
    data: MatchUpdateWithPlayerMatchesType,
    stats: UpsertStatsType[] = [],
    categoryId: number,
    previousResult: string | null,
    previousWinnerId?: number
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
        const updatedMatch = await updateMatch(Number(id), match);
        await upsertStats(stats, categoryId, data.result ?? '', previousResult, previousWinnerId);
        return updatedMatch;
    } catch (error) {
        throw new Error('Failed to update match result ' + error);
    }
}

export async function updateMatchBulkAction(data: MatchUpdateInputWithIdType[]) {
    return await updateMatchBulk(data);
}

export async function deleteMatchAction(id: number) {
    return await deleteMatch(Number(id));
}

export async function deleteMatchBulkAction(ids: number[]) {
    return await deleteMatchBulk(ids);
}

export async function validateMatchAction(data: ValidateMatchType) {
    const { hour, matchDayId, courtId, teamsWithPlayerIds, categoryId } = data;
    const playerIds = teamsWithPlayerIds.map((team) => team.playerIds).flat();

    const checkCourtAvailability = await getMatchByCourtAndHour(courtId, hour, matchDayId!);

    if (checkCourtAvailability && checkCourtAvailability > 0) {
        throw new Error('La cancha ya tiene un partido programado a esta hora');
    }

    const checkMatchesByCategoryAndDayByPlayerIds = await getMatchByPlayerIdAndCategoryAndDay(
        playerIds,
        categoryId,
        matchDayId!
    );

    if (checkMatchesByCategoryAndDayByPlayerIds && checkMatchesByCategoryAndDayByPlayerIds.length > 0) {
        const names = checkMatchesByCategoryAndDayByPlayerIds
            .map((match) => match.playerMatches.map((pm) => pm.player.firstName + ' ' + pm.player.lastName))
            .flat();
        throw new Error(
            'Los siguientes jugadores ya tienen un partido para esta categoria en este dia: ' + names.join(', ')
        );
    }

    const checkMatchesByHourAndPlayerId = await getMatchesByHourAndPlayerId(playerIds, hour, matchDayId!);

    if (checkMatchesByHourAndPlayerId && checkMatchesByHourAndPlayerId.length > 0) {
        const names = checkMatchesByHourAndPlayerId
            .map((match) => match.playerMatches.map((pm) => pm.player.firstName + ' ' + pm.player.lastName))
            .flat();
        throw new Error('Los siguientes jugadores ya tienen un partido en este horario: ' + names.join(', '));
    }

    const previousMatchesByPlayerIdsAndCategory = await getMatchesByPlayerIdsAndCategory(
        teamsWithPlayerIds,
        categoryId
    );

    if (previousMatchesByPlayerIdsAndCategory && previousMatchesByPlayerIdsAndCategory.length > 0) {
        const names = previousMatchesByPlayerIdsAndCategory
            .map((match) => match.playerMatches.map((pm) => pm.player.firstName + ' ' + pm.player.lastName))
            .flat();
        throw new Error('Los siguientes jugadores ya jugaron en contra en esta categoria: ' + names.join(', '));
    }

    return {
        hour,
        matchDayId,
        courtId,
        playerIds,
        categoryId,
    };
}
