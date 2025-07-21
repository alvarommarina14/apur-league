import { Prisma } from '@/generated/prisma';

export type MatchDayWithMatchesType = Prisma.MatchDayGetPayload<{
    include: {
        matches: {
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
        };
    };
}>;
