import { NextResponse, NextRequest } from 'next/server';

import { deleteMatchDay } from '@/lib/services/matchDay';

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const matchDay = await deleteMatchDay(Number(id));

        return NextResponse.json(matchDay);
    } catch (error) {
        console.error('Error deleting match day:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
