import { prisma } from '@/lib/prisma';

export async function deleteMatchDay(id: number) {
    return prisma.matchDay.delete({
        where: { id: Number(id) },
    });
}

export async function createMatchDay(data: { matchWeekId: number; date: string }) {
    return await prisma.matchDay.create({ data });
}

export async function getMatchDayById(id: number) {
    return prisma.matchDay.findFirst({
        where: {
            id: id,
        },
    });
}
