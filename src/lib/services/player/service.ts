import { prisma } from '@/lib/prisma';

export async function GetAllPlayers() {
    return prisma.player.findMany({
        include: {
            playerCategories: {
                include: {
                    category: true,
                },
            },
            playerMatches: {
                include: {
                    match: true,
                },
            },
            categoryPoints: {
                include: {
                    category: true,
                },
            },
        },
    });
}

export async function GetPlayerById(id: number) {
    return prisma.player.findUnique({
        where: { id },
        include: {
            playerCategories: {
                include: {
                    category: true,
                },
            },
            playerMatches: {
                include: {
                    match: true,
                },
            },
            categoryPoints: {
                include: {
                    category: true,
                },
            },
        },
    });
}
