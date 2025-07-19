import { prisma } from '@/lib/prisma';

export async function getAllClubs() {
    return prisma.club.findMany({
        include: {
            courts: true,
        },
    });
}

export async function getClubById(id: number) {
    return prisma.club.findUnique({
        where: { id },
    });
}
