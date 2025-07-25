import { prisma } from '@/lib/prisma';
import { PlayerCategoryStats, Prisma as PrismaTypes } from '@/generated/prisma';
import {
    PlayerCategoryStatsPromotionsType,
    PlayerCategoryStatsCreateType,
    PlayerCategoryStatsUpdateType,
} from '@/types/stats';

export async function getPlayersStatsByCategory({
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

    const rawPlayers = await prisma.playerCategoryStats.findMany({
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
                },
            },
        },
    });

    const demotingAndPromotingPlayers = await getDemotingAndPromotingPlayersByCategory(categoryId);

    const promotingPlayerIds = demotingAndPromotingPlayers.slice(0, 3).map((p) => p.playerId);

    const demotingPlayerIds = demotingAndPromotingPlayers.slice(3, 6).map((p) => p.playerId);

    const players = rawPlayers.map((p) => {
        const isPromoting = promotingPlayerIds.includes(p.player.id);

        const isDemoting = !isPromoting && demotingPlayerIds.includes(p.player.id);

        const { player, ...stats } = p;
        const result: PlayerCategoryStatsPromotionsType = {
            ...stats,
            playerId: player.id,
            firstName: player.firstName,
            lastName: player.lastName,
            isDemoting,
            isPromoting,
        };
        return result;
    });

    return players;
}

export async function countPlayersByFilters(categoryId?: number, search?: string) {
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

export async function getDemotingAndPromotingPlayersByCategory(categoryId: number): Promise<PlayerCategoryStats[]> {
    return await prisma.$queryRaw`
        (SELECT "playerId" FROM "PlayerCategoryStats" 
         WHERE "categoryId" = ${categoryId}::integer 
         ORDER BY points DESC,"matchesWon" ASC,"matchesPlayed" DESC,"diffSets" DESC,"diffGames" DESC 
         LIMIT 3)
        UNION ALL
        (SELECT "playerId" FROM "PlayerCategoryStats" 
         WHERE "categoryId" = ${categoryId}::integer 
         ORDER BY points ASC,"matchesPlayed" DESC,"diffSets" ASC,"diffGames" ASC
         LIMIT 3)
    `;
}

export async function getPlayerStatsByPlayerIdsAndCategoryId(categoryId: number, playerIds: number[]) {
    return await prisma.playerCategoryStats.findMany({
        where: {
            categoryId: categoryId,
            playerId: { in: playerIds },
        },
    });
}

export async function createStatsBulk(data: PlayerCategoryStatsCreateType | PlayerCategoryStatsCreateType[]) {
    if (Array.isArray(data)) {
        return await prisma.playerCategoryStats.createMany({
            data: data,
        });
    } else {
        return await prisma.playerCategoryStats.create({
            data: data,
        });
    }
}

export async function updateStatsBulk(data: PlayerCategoryStatsUpdateType[]) {
    const transactionOperations = data.map((item) =>
        prisma.playerCategoryStats.update({
            where: { id: item.id },
            data: item.data,
        })
    );

    return await prisma.$transaction(transactionOperations);
}
