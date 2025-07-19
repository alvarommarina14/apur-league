import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
    Player,
    PlayerCategoryStats,
    Prisma as PrismaTypes,
} from '@/generated/prisma';
import { PlayerCategoryStatsPromotionsType } from '@/types/stats';

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

export async function getPlayerStatsByCategory({
    search,
    categoryId,
    page = 1,
    perPage = 50,
}: {
    search?: string;
    categoryId: number;
    page?: number;
    perPage?: number;
}) {
    const filters: PrismaTypes.PlayerCategoryStatsWhereInput = {
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

    const rawPlayers = await prismaExtended.playerCategoryStats.findMany({
        where: filters,
        orderBy: [
            { points: 'desc' },
            { matchesWon: 'asc' },
            { matchesPlayed: 'desc' },
            { diffSets: 'desc' },
            { diffGames: 'desc' },
        ],
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
            player: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    age: true,
                },
            },
        },
    });

    const demotingAndPromotingPlayers =
        await getDemotingAndPromotingPlayersByCategory(categoryId);

    const promotingPlayerIds = demotingAndPromotingPlayers
        .slice(0, 2)
        .map((p) => p.playerId);

    const demotingPlayerIds = demotingAndPromotingPlayers
        .slice(3, 5)
        .map((p) => p.playerId);

    const players = rawPlayers.map((p) => {
        const isPromoting = promotingPlayerIds.includes(p.player.id);

        const isDemoting =
            !isPromoting && demotingPlayerIds.includes(p.player.id);

        const { player, ...stats } = p;
        const result: PlayerCategoryStatsPromotionsType = {
            ...stats,
            firstName: player.firstName,
            lastName: player.lastName,
            age: player.age,
            isDemoting,
            isPromoting,
        };
        return result;
    });

    return players;
}

export async function countPlayersByFilters(
    categoryId?: number,
    search?: string
) {
    return prisma.playerCategoryStats.count({
        where: {
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
        },
    });
}

export async function getDemotingAndPromotingPlayersByCategory(
    categoryId: number
): Promise<PlayerCategoryStats[]> {
    return await prisma.$queryRaw`
        (SELECT "playerId" FROM "PlayerCategoryStats" 
         WHERE "categoryId" = ${categoryId}::integer 
         ORDER BY points DESC 
         LIMIT 3)
        UNION ALL
        (SELECT "playerId" FROM "PlayerCategoryStats" 
         WHERE "categoryId" = ${categoryId}::integer 
         ORDER BY points ASC 
         LIMIT 3)
    `;
}
