import { prisma } from '@/lib/prisma';

export async function deleteMatchDay(id: number) {
    return prisma.matchDay.delete({
        where: { id: Number(id) },
    });
}

export async function createMatchDay(data: {
    matchWeekId: number;
    date: Date;
}) {
    return await prisma.matchDay.create({ data });
}
