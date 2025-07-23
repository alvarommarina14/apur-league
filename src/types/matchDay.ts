import { Prisma } from '@/generated/prisma';

export type MatchDayWithMatchesType = Prisma.MatchDayGetPayload<{
    include: {
        matches: {
            include: {
                playerMatches: {
                    include: {
                        player: {
                            include: {
                                categoryStats: true;
                            };
                        };
                    };
                    team: true;
                };
                category: true;
                court: {
                    include: {
                        club: true;
                    };
                };
            };
        };
    };
}>;
