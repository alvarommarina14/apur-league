import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { Player, Prisma as PrismaTypes } from '@/generated/prisma';
import { PlayerWithPoints } from '@/types/points';

const playerAgeExtension = Prisma.defineExtension({
    result: {
        player: {
            age: {
                needs: { dateOfBirth: true },
                compute(player: Player) {
                    if (!player.dateOfBirth) {
                        return null;
                    }
                    const today = new Date();
                    const birthDate = new Date(player.dateOfBirth);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (
                        m < 0 ||
                        (m === 0 && today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }
                    return age;
                },
            },
        },
    },
});

const prismaExtended = prisma.$extends(playerAgeExtension);

export async function getPlayerPointsByCategory({
    search,
    categoryId,
    page = 1,
    perPage = 50,
}: {
    search?: string;
    categoryId?: number;
    page?: number;
    perPage?: number;
}) {
    const filters: PrismaTypes.PlayerCategoryPointsWhereInput = {
        AND: [
            categoryId ? { categoryId: Number(categoryId) } : {},
            search
                ? {
                      player: {
                          OR: [
                              {
                                  firstName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  lastName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                          ],
                      },
                  }
                : {},
        ],
    };

    const [rawPlayers, totalCount] = await Promise.all([
        prismaExtended.playerCategoryPoints.findMany({
            where: filters,
            orderBy: { points: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        age: true,
                        _count: {
                            select: {
                                playerMatches: {
                                    where: categoryId
                                        ? {
                                              match: {
                                                  categoryId:
                                                      Number(categoryId),
                                              },
                                          }
                                        : undefined,
                                },
                            },
                        },
                    },
                },
            },
        }),

        prisma.playerCategoryPoints.count({ where: filters }),
    ]);

    const players = rawPlayers.map((playerPoints) => {
        const { player, points } = playerPoints;
        const { _count, age, firstName, lastName, id } = player;
        const result: PlayerWithPoints = {
            points,
            id,
            age,
            firstName,
            lastName,
            matchesInCategory: _count.playerMatches,
        };
        return result;
    });
    return { players, totalCount };
}

export async function getPlayerPointsByCategoryv2({
    search,
    categoryId,
    page = 1,
    perPage = 50,
}: {
    search?: string;
    categoryId?: number;
    page?: number;
    perPage?: number;
}) {
    const filters: PrismaTypes.PlayerCategoryPointsWhereInput = {
        AND: [
            categoryId ? { categoryId: Number(categoryId) } : {},
            search
                ? {
                      player: {
                          OR: [
                              {
                                  firstName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  lastName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                          ],
                      },
                  }
                : {},
        ],
    };

    const rawPlayers = await prismaExtended.playerCategoryPoints.findMany({
        where: filters,
        orderBy: { points: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
            player: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    age: true,
                    _count: {
                        select: {
                            playerMatches: {
                                where: categoryId
                                    ? {
                                          match: {
                                              categoryId: Number(categoryId),
                                          },
                                      }
                                    : undefined,
                            },
                        },
                    },
                },
            },
        },
    });

    const players = rawPlayers.map((playerPoints) => {
        const { player, points } = playerPoints;
        const { _count, age, firstName, lastName, id } = player;
        const result: PlayerWithPoints = {
            points,
            id,
            age,
            firstName,
            lastName,
            matchesInCategory: _count.playerMatches,
        };
        return result;
    });
    return players;
}

export async function countPlayersByCategory(categoryId?: number) {
    const filters: PrismaTypes.PlayerCategoryPointsWhereInput = {
        categoryId: categoryId ? Number(categoryId) : undefined,
    };

    return prisma.playerCategoryPoints.count({ where: filters });
}
