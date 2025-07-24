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

export async function createPlayerCategoryBulk(playerId: number, categoryIds: number[]) {
    await prisma.playerCategory.createMany({
        data: categoryIds.map((categoryId) => ({
            playerId: playerId,
            categoryId: categoryId,
        })),
    });
}
