import { PlayerCategoryStats } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma';

export type PlayerCategoryStatsPromotionsType = PlayerCategoryStats & {
    firstName: string;
    lastName: string;
    age: number | null;
    isPromoting: boolean;
    isDemoting: boolean;
};

export type PlayerCategoryStatsCreateType = Prisma.PlayerCategoryStatsUncheckedCreateInput;

export type PlayerCategoryStatsUpdateType = Prisma.PlayerCategoryStatsUncheckedUpdateInput;

export type PlayersMatchStatsType = {
    winnerGames: number;
    winnerSets: number;
    loserGames: number;
    loserSets: number;
};
