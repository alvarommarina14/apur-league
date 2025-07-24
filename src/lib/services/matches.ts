import { prisma } from '@/lib/prisma';
import { MatchCreateInputType, MatchUpdateInputType, MatchUpdateInputWithIdType } from '@/types/matches';
import { getMatchDayById } from '@/lib/services/matchDay';
import { HOUR_AND_HALF_MINUTES } from '@/lib/constants';
import { PlayerMatchTeamsWithPlayersType } from '@/types/playerMatch';
import { Team } from '@/generated/prisma';
import { addMinute } from '@formkit/tempo';
export async function getMatchById(id: number) {
    return await prisma.match.findUnique({
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

export async function getMatchByCourtAndHour(courtId: number, hour: Date, matchDayId: number) {
    const matchDay = await getMatchDayById(matchDayId);
    if (!matchDay) {
        throw new Error('Match day not found');
    }

    const startHour = addMinute(hour, -HOUR_AND_HALF_MINUTES);
    const endHour = addMinute(hour, HOUR_AND_HALF_MINUTES);
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

export async function getMatchByPlayerIdAndCategoryAndDay(playerIds: number[], categoryId: number, matchDayId: number) {
    return await prisma.match.findMany({
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
                where: {
                    playerId: { in: playerIds },
                },
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function getMatchesByHourAndPlayerId(playerIds: number[], hour: Date, matchDayId: number) {
    const matchDay = await getMatchDayById(matchDayId);

    if (!matchDay) {
        throw new Error('Match day not found');
    }

    const startHour = addMinute(hour, -HOUR_AND_HALF_MINUTES);
    const endHour = addMinute(hour, HOUR_AND_HALF_MINUTES);
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
                where: {
                    playerId: { in: playerIds },
                },
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
                where: { OR: [{ playerId: { in: groupA_players } }, { playerId: { in: groupB_players } }] },
                include: {
                    player: true,
                },
            },
        },
    });
}
