import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

type MatchUpdateInput = Prisma.MatchUncheckedUpdateInput;

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

export async function updateMatch(data: MatchUpdateInput) {
    const { id, ...updateData } = data;
    await prisma.match.update({
        where: { id: Number(id) },
        data: updateData,
    });
}

export async function updateMatchBulk(data: MatchUpdateInput[]) {
    await prisma.$transaction(async (prisma) => {
        data.map(async (match: MatchUpdateInput) => {
            const { id, ...updateData } = match;
            await prisma.match.update({
                where: { id: Number(id) },
                data: updateData,
            });
        });
    });
}

export async function createMatch(data: Prisma.MatchCreateInput) {
    return prisma.match.create({
        data,
    });
}

export async function createMatchBulk(data: Prisma.MatchCreateInput[]) {
    return prisma.match.createMany({
        data,
    });
}

export async function deleteMatch(id: number) {
    return prisma.match.delete({
        where: { id: Number(id) },
    });
}

export async function deleteMatchBulk(ids: number[]) {
    return prisma.match.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
}
