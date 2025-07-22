import { prisma } from '@/lib/prisma';
import { MatchCreateInputType, MatchUpdateInputType, MatchUpdateInputWithIdType } from '@/types/matches';
import { getMatchDayById } from '@/lib/services/matchDay';
import { HOUR_AND_HALF_MS } from '@/lib/constants';
import { PlayerMatchTeamsWithPlayersType } from '@/types/playerMatch';
import { Team } from '@/generated/prisma';

export async function getMatchById(id: number) {
    prisma.match.findUnique({
        where: { id: Number(id) },
        include: {
            category: true,
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function createMatch(data: MatchCreateInputType) {
    return prisma.match.create({
        data,
    });
}

export async function createMatchBulk(data: MatchCreateInputType[]) {
    return prisma.$transaction(async (prisma) => {
        const createdMatches = await Promise.all(
            data.map(async (match: MatchCreateInputType) => {
                await prisma.match.create({
                    data: match,
                });
            })
        );
        return { count: createdMatches.length };
    });
}

export async function updateMatch(id: number, data: MatchUpdateInputType) {
    return prisma.match.update({
        where: { id: Number(id) },
        data,
    });
}

export async function updateMatchBulk(data: MatchUpdateInputWithIdType[]) {
    return prisma.$transaction(async (prisma) => {
        data.map(async (match: MatchUpdateInputWithIdType) => {
            const { id, ...updateData } = match;
            await prisma.match.update({
                where: { id: Number(id) },
                data: updateData,
            });
        });
    });
}

export async function deleteMatch(id: number) {
    return prisma.match.delete({
        where: { id: Number(id) },
    });
}

export async function deleteMatchBulk(ids: number[]) {
    return prisma.match.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
}

export async function getMatchByCourtAndHour(courtId: number, hour: string | Date, matchDayId: number) {
    const matchDay = await getMatchDayById(matchDayId);
    if (!matchDay) {
        throw new Error('Match day not found');
    }
    if (typeof hour === 'string') {
        const [hours, minutes] = hour.split(':').map(Number);
        const date = new Date(0);
        date.setUTCHours(hours);
        date.setUTCMinutes(minutes);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        const startHour = new Date(date.getTime() - HOUR_AND_HALF_MS);
        const endHour = new Date(date.getTime() + HOUR_AND_HALF_MS);
        return prisma.match.count({
            where: {
                courtId: courtId,
                matchDayId: matchDay.id,
                hour: {
                    gt: startHour,
                    lt: endHour,
                },
            },
        });
    }
}

export async function getMatchByPlayerIdAndCategoryAndDay(playerIds: number[], categoryId: number, matchDayId: number) {
    return prisma.match.findMany({
        where: {
            categoryId: categoryId,
            matchDayId: matchDayId,
            playerMatches: {
                some: {
                    playerId: { in: playerIds },
                },
            },
        },
        include: {
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function getMatchesByHourAndPlayerId(playerIds: number[], date: Date, matchDayId: number) {
    const matchDay = await getMatchDayById(matchDayId);

    if (!matchDay) {
        throw new Error('Match day not found');
    }

    const startHour = new Date(date.getTime() - HOUR_AND_HALF_MS);
    const endHour = new Date(date.getTime() + HOUR_AND_HALF_MS);
    return prisma.match.findMany({
        where: {
            matchDayId: matchDay.id,
            hour: {
                gt: startHour,
                lt: endHour,
            },
            playerMatches: {
                some: {
                    playerId: { in: playerIds },
                },
            },
        },
        include: {
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function getMatchesByPlayerIdsAndCategory(
    playerIdsWithTeams: PlayerMatchTeamsWithPlayersType[],
    categoryId: number
) {
    const groupA_players = playerIdsWithTeams.find((pm) => pm.team === Team.EQUIPO_1)?.playerIds || [];
    const groupB_players = playerIdsWithTeams.find((pm) => pm.team === Team.EQUIPO_2)?.playerIds || [];

    return prisma.match.findMany({
        where: {
            categoryId: categoryId,
            OR: [
                {
                    AND: [
                        {
                            playerMatches: {
                                some: {
                                    playerId: { in: groupA_players },
                                    team: Team.EQUIPO_1,
                                },
                            },
                        },
                        {
                            playerMatches: {
                                some: {
                                    playerId: { in: groupB_players },
                                    team: Team.EQUIPO_2,
                                },
                            },
                        },
                    ],
                },
                {
                    AND: [
                        {
                            playerMatches: {
                                some: {
                                    playerId: { in: groupA_players },
                                    team: Team.EQUIPO_2,
                                },
                            },
                        },
                        {
                            playerMatches: {
                                some: {
                                    playerId: { in: groupB_players },
                                    team: Team.EQUIPO_1,
                                },
                            },
                        },
                    ],
                },
            ],
        },
        include: {
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}
