import { PlayerCategoryStats } from '@/generated/prisma';

export type PlayerCategoryStatsPromotionsType = PlayerCategoryStats & {
    firstName: string;
    lastName: string;
    age: number | null;
    isPromoting: boolean;
    isDemoting: boolean;
};
