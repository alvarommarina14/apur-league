import { prisma } from '@/lib/prisma';

export async function getAllMatches() {
    return prisma.match.findMany({
        include: {
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function getMatchById(id: number) {
    prisma.match.findUnique({
        where: { id: Number(id) },
        include: {
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}
