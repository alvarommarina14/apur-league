import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

import { getAllPlayers } from '@/lib/services/player';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') ?? undefined;
        const filterByCategory =
            searchParams.get('filterByCategory') ?? undefined;
        const sortOrder =
            (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'asc';
        const page = Number(searchParams.get('page')) || 1;
        const perPage = Number(searchParams.get('perPage')) || 50;

        const players = await getAllPlayers({
            search,
            filterByCategory,
            sortOrder,
            page,
            perPage,
        });

        return NextResponse.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

type PlayerUpdateInput = Prisma.PlayerUncheckedUpdateInput;

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        await prisma.$transaction(async (prisma) => {
            data.map(async (player: PlayerUpdateInput) => {
                const { id, ...updateData } = player;
                await prisma.player.update({
                    where: { id: Number(id) },
                    data: updateData,
                });
            });
        });

        return NextResponse.json(
            {
                message: `Successfully updated ${data.size} players.`,
                updatedCount: data.size,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const result = await prisma.player.createMany({
            data,
        });

        return NextResponse.json(
            {
                message: `Successfully created ${result.count} players.`,
                createdCount: result.count,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'number')) {
            return NextResponse.json(
                { error: 'Invalid input: "ids" must be an array of numbers.' },
                { status: 400 }
            );
        }

        const result = await prisma.player.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return NextResponse.json(
            {
                message: `Successfully deleted ${result.count} players.`,
                deletedCount: result.count,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting players:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
