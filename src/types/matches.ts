import { Prisma } from '@/generated/prisma';
import { Type } from '@/generated/prisma';

export type MatchCreateInputType = Prisma.MatchCreateInput;
export type MatchUpdateInputType = Prisma.MatchUpdateInput;
export type MatchUpdateInputWithIdType = Prisma.MatchUncheckedUpdateInput;
export type MatchUpdateWithPlayerMatchesType = {
    result?: string;
    playerMatches?: {
        playerId: number;
        matchId: number;
        winner: boolean;
    }[];
};

export type MatchUpdateResultType = Prisma.MatchGetPayload<{
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

export type MatchModeType = Type;
