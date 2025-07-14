import { prisma } from '@/lib/prisma';
import {
    MatchCreateInputType,
    MatchUpdateInputType,
    MatchUpdateInputWithIdType,
} from '@/types/matches';

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

export async function createMatch(data: MatchCreateInputType) {
    return prisma.match.create({
        data,
    });
}

export async function createMatchBulk(data: MatchCreateInputType[]) {
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

export async function updateMatch(id: number, data: MatchUpdateInputType) {
    return prisma.match.update({
        where: { id: Number(id) },
        data,
    });
}

export async function updateMatchBulk(data: MatchUpdateInputWithIdType[]) {
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
