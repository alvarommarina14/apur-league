import { prisma } from '@/lib/prisma';

export async function getMatchWeekWithMatches({
    matchWeekId,
    categoryId,
    search,
    clubId,
    matchDayId,
}: {
    matchWeekId: number;
    categoryId?: number;
    search?: string;
    clubId?: number;
    matchDayId?: number;
}) {
    return await prisma.matchWeek.findUnique({
        where: {
            id: matchWeekId,
        },
        include: {
            matchDays: {
                where: {
                    ...(matchDayId && { id: matchDayId }),
                },
                orderBy: { date: 'asc' },
                include: {
                    matches: {
                        orderBy: { hour: 'asc' },
                        where: {
                            ...(categoryId && { categoryId }),
                            ...(search && {
                                playerMatches: {
                                    some: {
                                        player: {
                                            OR: [
                                                {
                                                    firstName: {
                                                        contains: search,
                                                        mode: 'insensitive' as const,
                                                    },
                                                },
                                                {
                                                    lastName: {
                                                        contains: search,
                                                        mode: 'insensitive' as const,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            }),
                            ...(clubId && {
                                court: {
                                    is: {
                                        clubId: clubId,
                                    },
                                },
                            }),
                        },
                        include: {
                            playerMatches: {
                                include: {
                                    player: {
                                        include: {
                                            categoryStats: true,
                                        },
                                    },
                                },
                            },
                            category: true,
                            court: {
                                include: {
                                    club: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

export async function getAllMatchWeek() {
    const weeks = await prisma.matchWeek.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return weeks;
}

export async function getAllMatchWeekWithMatchDays() {
    const weeks = await prisma.matchWeek.findMany({
        orderBy: {
            order: 'desc',
        },
        include: {
            matchDays: true,
        },
    });

    return weeks;
}

export async function createMatchWeek() {
    const lastWeek = await prisma.matchWeek.findFirst({
        orderBy: { order: 'desc' },
        include: { matchDays: true },
    });

    if (lastWeek && lastWeek.matchDays.length === 0) {
        throw new Error('No se puede crear una nueva fecha hasta que la anterior tenga días cargados');
    }

    const nextOrder = lastWeek ? lastWeek.order + 1 : 1;

    const newMatchWeek = await prisma.matchWeek.create({
        data: {
            name: `Fecha ${nextOrder}`,
            order: nextOrder,
        },
    });

    return newMatchWeek;
}
