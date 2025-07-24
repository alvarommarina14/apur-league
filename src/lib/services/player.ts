import { prisma } from '@/lib/prisma';
import { createPlayerCategoryBulk } from '@/lib/services/category';

export async function getAllPlayers({
    search,
    categoryId,
    sortOrder = 'asc',
    page = 1,
    perPage = 50,
    isActive = true,
}: {
    search?: string;
    categoryId?: number;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    perPage?: number;
    isActive?: boolean;
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
            { isActive },
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
            categoryStats: {
                include: {
                    category: true,
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

export async function getPlayerById(id: number, isActive: boolean = true) {
    return prisma.player.findUnique({
        where: { id, isActive },
        include: {
            playerCategories: {
                include: {
                    category: true,
                },
            },
            playerMatches: {
                include: {
                    match: {
                        include: {
                            category: true,
                            matchDay: true,
                        },
                    },
                },
            },
            categoryStats: {
                include: {
                    category: true,
                },
            },
        },
    });
}

export async function createPlayer(data: { firstName: string; lastName: string; categoryIds: number[] }) {
    const newPlayer = await prisma.player.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
        },
    });

    await createPlayerCategoryBulk(newPlayer.id, data.categoryIds);

    return newPlayer;
}

export async function updatePlayerData(
    id: number,
    data: { firstName: string; lastName: string; categoryIds: number[] }
) {
    const [updatedPlayer] = await prisma.$transaction([
        prisma.player.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
            },
        }),
        prisma.playerCategory.deleteMany({
            where: { playerId: id },
        }),
        prisma.playerCategory.createMany({
            data: data.categoryIds.map((catId) => ({
                playerId: id,
                categoryId: catId,
            })),
        }),
    ]);

    return updatedPlayer;
}

export async function updatePlayerStatus(id: number, newStatus: boolean) {
    return await prisma.player.update({
        where: { id: id },
        data: { isActive: newStatus },
    });
}

export async function deletePlayerById(id: number) {
    return await prisma.player.delete({
        where: { id },
    });
}
