import { Team } from '@/generated/prisma';

export type PlayerMatchTeamsWithPlayersType = {
    playerIds: number[];
    team: Team;
};
