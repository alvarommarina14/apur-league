import { prisma } from '@/lib/prisma';

export async function deleteMatchDay(id: number) {
    return prisma.matchDay.delete({
        where: { id: Number(id) },
    });
}
