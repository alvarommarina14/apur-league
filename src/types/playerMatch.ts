import { Team } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma';

export type PlayerMatchTeamsWithPlayersType = {
    playerIds: number[];
    team: Team;
};

export type PlayerMatchWithPlayersType = Prisma.PlayerMatchGetPayload<{
    include: {
        player: true;
        team: true;
    };
}>;
