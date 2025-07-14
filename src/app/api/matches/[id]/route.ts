import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const data = await request.json();

        const match = await prisma.match.update({
            where: { id: Number(data.id) },
            data,
        });

        return NextResponse.json(match);
    } catch (error) {
        console.error('Error updating match:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const match = await prisma.match.create({
            data,
        });

        return NextResponse.json(match);
    } catch (error) {
        console.error('Error creating match:', error);
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

        const match = await prisma.match.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(match);
    } catch (error) {
        console.error('Error deleting match:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
