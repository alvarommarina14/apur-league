import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

import { getPlayerById } from '@/lib/services/player';

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const player = await getPlayerById(Number(id));

        return NextResponse.json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const player = await prisma.player.update({
            where: { id: Number(data.id) },
            data,
        });
        return NextResponse.json(player);
    } catch (error) {
        console.error('Error updating player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const player = await prisma.player.create({
            data,
        });
        return NextResponse.json(player);
    } catch (error) {
        console.error('Error creating player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const player = await prisma.player.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(player);
    } catch (error) {
        console.error('Error deleting player:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
