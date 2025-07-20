import { MatchWeek, Prisma } from '@/generated/prisma';

export type MatchWeekType = MatchWeek;

export type MatchWeekWithMatchDaysType = Prisma.MatchWeekGetPayload<{
    include: {
        matchDays: true;
    };
}>;
