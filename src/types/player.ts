import { Prisma } from '@/generated/prisma';

export type PlayerType = Prisma.PlayerGetPayload<{
    include: {
        playerCategories: {
            include: {
                category: true;
            };
        };

        categoryStats: {
            include: {
                category: true;
            };
        };
    };
}>;
