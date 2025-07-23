import { Prisma } from '@/generated/prisma';
import { Type } from '@/generated/prisma';
import { PlayerMatchTeamsWithPlayersType } from '@/types/playerMatch';

export type MatchCreateInputType = Omit<Prisma.MatchUncheckedCreateInput, 'hour'> & {
    hour: Date;
};

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
                player: {
                    include: {
                        categoryStats: true;
                    };
                };
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

export type ValidateMatchType = MatchCreateInputType & {
    teamsWithPlayerIds: PlayerMatchTeamsWithPlayersType[];
};
