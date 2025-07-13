import { prisma } from '@/lib/prisma';

export async function GetAllCategories() {
    return prisma.category.findMany();
}

export async function GetCategoryById(id: number) {
    return prisma.player.findUnique({
        where: { id },
    });
}
