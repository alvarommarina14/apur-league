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
import { PlayerMatchTeamsWithPlayersType } from '@/types/playerMatch';

interface ValidationResult {
    isValid: boolean;
    error?: string;
}

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
    } catch {
        throw new Error('No se pudo crear el partido');
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
    const playerIds = teamsWithPlayerIds.flatMap((team) => team.playerIds);

    const [courtAvailability, matchesByCategory, matchesByHour, previousMatches] = await Promise.all([
        validateCourtAvailability(courtId, hour, matchDayId!),
        validatePlayerAvailability(playerIds, categoryId, matchDayId!, 'category'),
        validatePlayerAvailability(playerIds, hour, matchDayId!, 'hour'),
        validatePreviousMatches(teamsWithPlayerIds, categoryId),
    ]);

    const validations = [courtAvailability, matchesByHour, matchesByCategory, previousMatches];

    for (const validation of validations) {
        if (!validation.isValid) {
            throw new MatchValidationError(validation.error!);
        }
    }

    return { hour, matchDayId, courtId, playerIds, categoryId };
}

async function validateCourtAvailability(courtId: number, hour: Date, matchDayId: number): Promise<ValidationResult> {
    const count = await getMatchByCourtAndHour(courtId, hour, matchDayId);
    return {
        isValid: count === 0,
        error: 'La cancha ya tiene un partido programado a esta hora',
    };
}

async function validatePlayerAvailability(
    playerIds: number[],
    filter: Date | number,
    matchDayId: number,
    type: 'hour' | 'category'
): Promise<ValidationResult> {
    const matches =
        type === 'hour'
            ? await getMatchesByHourAndPlayerId(playerIds, filter as Date, matchDayId)
            : await getMatchByPlayerIdAndCategoryAndDay(playerIds, filter as number, matchDayId);

    if (matches.length === 0) return { isValid: true };

    const names = matches.flatMap((match) =>
        match.playerMatches.map((pm) => `${pm.player.firstName} ${pm.player.lastName}`)
    );
    const uniqueNames = [...new Set(names)];

    return {
        isValid: false,
        error:
            type === 'hour'
                ? `Los siguientes jugadores ya tienen un partido en este horario: ${uniqueNames.join(', ')}`
                : `Los siguientes jugadores ya tienen un partido para esta categoría en este día: ${uniqueNames.join(', ')}`,
    };
}

async function validatePreviousMatches(
    teamsWithPlayerIds: PlayerMatchTeamsWithPlayersType[],
    categoryId: number
): Promise<ValidationResult> {
    const matches = await getMatchesByPlayerIdsAndCategory(teamsWithPlayerIds, categoryId);

    if (matches.length === 0) return { isValid: true };

    const names = matches.flatMap((match) =>
        match.playerMatches.map((pm) => `${pm.player.firstName} ${pm.player.lastName}`)
    );
    const uniqueNames = [...new Set(names)];

    return {
        isValid: false,
        error: `Los siguientes jugadores ya jugaron en contra en esta categoría: ${uniqueNames.join(', ')}`,
    };
}

class MatchValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MatchValidationError';
    }
}
