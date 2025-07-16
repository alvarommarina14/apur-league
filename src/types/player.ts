import { Prisma } from '@/generated/prisma';

export type PlayerType = Prisma.PlayerGetPayload<{
    include: {
        playerCategories: {
            include: {
                category: true;
            };
        };
        playerMatches: {
            include: {
                match: true;
            };
        };
        categoryPoints: {
            include: {
                category: true;
            };
        };
    };
}>;
