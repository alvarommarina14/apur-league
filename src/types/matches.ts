import { Prisma } from '@/generated/prisma';

export type MatchUpdateInputType = Prisma.MatchUpdateInput;
export type MatchUpdateInputWithIdType = Prisma.MatchUncheckedUpdateInput;
export type MatchCreateInputType = Prisma.MatchCreateInput;

export type MatchWithPlayersAndCategoryType = Prisma.MatchGetPayload<{
    include: {
        playerMatches: {
            include: {
                player: true;
            };
        };
        category: true;
        court: {
            include: {
                club: true;
            };
        };
    };
}>;
