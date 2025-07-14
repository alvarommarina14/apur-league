import { NextResponse, NextRequest } from 'next/server';
import { updateMatch, deleteMatch } from '@/lib/services/matches';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const data = await request.json();

        const match = await updateMatch(Number(id), data);

        return NextResponse.json(match);
    } catch (error) {
        console.error('Error updating match:', error);
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

        const match = await deleteMatch(Number(id));

        return NextResponse.json(match);
    } catch (error) {
        console.error('Error deleting match:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
