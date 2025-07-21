import { prisma } from '@/lib/prisma';
import { MatchCreateInputType, MatchUpdateInputType, MatchUpdateInputWithIdType } from '@/types/matches';

export async function getMatchByIdService(id: number) {
    prisma.match.findUnique({
        where: { id: Number(id) },
        include: {
            category: true,
            playerMatches: {
                include: {
                    player: true,
                },
            },
        },
    });
}

export async function createMatchService(data: MatchCreateInputType) {
    return prisma.match.create({
        data,
    });
}

export async function createMatchBulkService(data: MatchCreateInputType[]) {
    return prisma.$transaction(async (prisma) => {
        const createdMatches = await Promise.all(
            data.map(async (match: MatchCreateInputType) => {
                await prisma.match.create({
                    data: match,
                });
            })
        );
        return { count: createdMatches.length };
    });
}

export async function updateMatchService(id: number, data: MatchUpdateInputType) {
    return prisma.match.update({
        where: { id: Number(id) },
        data,
    });
}

export async function updateMatchBulkService(data: MatchUpdateInputWithIdType[]) {
    return prisma.$transaction(async (prisma) => {
        data.map(async (match: MatchUpdateInputWithIdType) => {
            const { id, ...updateData } = match;
            await prisma.match.update({
                where: { id: Number(id) },
                data: updateData,
            });
        });
    });
}

export async function deleteMatchService(id: number) {
    return prisma.match.delete({
        where: { id: Number(id) },
    });
}

export async function deleteMatchBulkService(ids: number[]) {
    return prisma.match.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
}
