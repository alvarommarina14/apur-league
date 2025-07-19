import { Prisma } from '@/generated/prisma';
import { Club } from '@/generated/prisma';

export type ClubType = Club;

export type ClubWithCourtsType = Prisma.ClubGetPayload<{
    include: {
        courts: true;
    };
}>;
