import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const players = await prisma.player.findMany();
        return NextResponse.json(players);
    } catch (error) {
        console.error('Error fetching player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        const result = await prisma.player.updateMany({
            where: { id: Number(data.id) },
            data,
        });

        return NextResponse.json(
            {
                message: `Successfully updated ${result.count} players.`,
                deletedCount: result.count,
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
                deletedCount: result.count,
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
        console.error('Error performing bulk delete:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
