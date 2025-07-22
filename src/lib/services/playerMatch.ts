import { prisma } from '@/lib/prisma';
import { PlayerMatchTeamsWithPlayersType } from '@/types/playerMatch';

export async function createPlayerMatch(matchId: number, data: PlayerMatchTeamsWithPlayersType[]) {
    const transactions = data.map((team) => {
        return team.playerIds.map((playerId) => {
            return prisma.playerMatch.create({
                data: {
                    playerId: playerId,
                    matchId: matchId,
                    team: team.team,
                },
            });
        });
    });
    return await prisma.$transaction(transactions.flat());
}
