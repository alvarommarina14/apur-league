import { prisma } from '@/lib/prisma';

export async function getAllPlayers({
    search,
    categoryId,
    sortOrder = 'asc',
    page = 1,
    perPage = 50,
}: {
    search?: string;
    categoryId?: number;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    perPage?: number;
}) {
    const filters = {
        AND: [
            search
                ? {
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
                  }
                : {},
            categoryId
                ? {
                      playerCategories: {
                          some: {
                              category: { id: categoryId },
                          },
                      },
                  }
                : {},
        ].filter(Boolean),
    };

    const players = await prisma.player.findMany({
        where: filters,
        orderBy: {
            lastName: sortOrder,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
            playerCategories: {
                include: {
                    category: true,
                },
            },
            playerMatches: {
                include: {
                    match: true,
                },
            },
        },
    });

    const totalCount = await prisma.player.count({
        where: filters,
    });

    return {
        players,
        totalCount,
    };
}

export async function getPlayerById(id: number) {
    return prisma.player.findUnique({
        where: { id },
        include: {
            playerCategories: {
                include: {
                    category: true,
                },
            },
            playerMatches: {
                include: {
                    match: true,
                },
            },
            categoryPoints: {
                include: {
                    category: true,
                },
            },
        },
    });
}
