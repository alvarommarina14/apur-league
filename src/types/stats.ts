import { PlayerCategoryStats } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma';

export type PlayerCategoryStatsPromotionsType = PlayerCategoryStats & {
    firstName: string;
    lastName: string;
    isPromoting: boolean;
    isDemoting: boolean;
};

export type PlayerCategoryStatsCreateType = Prisma.PlayerCategoryStatsUncheckedCreateInput;

export type PlayerCategoryStatsUpdateType = { id: number; data: Prisma.PlayerCategoryStatsUpdateInput };

export type PlayersMatchStatsType = {
    winnerGames: number;
    winnerSets: number;
    loserGames: number;
    loserSets: number;
};

export type UpsertStatsType = {
    playerId: number;
    isWinner: boolean;
};
