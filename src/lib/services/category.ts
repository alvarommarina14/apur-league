import { prisma } from '@/lib/prisma';

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: {
            id: 'asc',
        },
    });
}

export async function getCategoryById(id: number) {
    return prisma.player.findUnique({
        where: { id },
    });
}
