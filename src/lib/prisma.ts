import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['warn', 'error'],
        ...(process.env.NODE_ENV !== 'production' && {
            __internal: {
                engine: {
                    statement_cache_size: 0,
                },
            },
        }),
    } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
