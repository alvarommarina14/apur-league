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

export async function getLastMatchWeek() {
    return await prisma.matchWeek.findFirst({
        orderBy: { order: 'desc' },
        include: { matchDays: true },
    });
}

export async function createMatchWeek(nextOrder: number) {
    const newMatchWeek = await prisma.matchWeek.create({
        data: {
            name: `Fecha ${nextOrder}`,
            order: nextOrder,
        },
    });

    return newMatchWeek;
}

export async function deleteMatchWeek({ matchWeekId }: { matchWeekId: number }) {
    return await prisma.matchWeek.delete({
        where: { id: matchWeekId },
    });
}
