import { NextResponse, NextRequest } from 'next/server';
import {
    updateMatchBulk,
    createMatchBulk,
    createMatch,
    deleteMatchBulk,
} from '@/lib/services/matches';

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        await updateMatchBulk(data);

        return NextResponse.json(
            {
                message: `Successfully updated ${data.size} players.`,
                updatedCount: data.size,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating matches:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!Array.isArray(data) || data.length === 0) {
            const result = await createMatch(data);
            return NextResponse.json(result);
        }

        const result = await createMatchBulk(data);
        return NextResponse.json(
            {
                message: `Successfully created ${result.count} matches.`,
                createdCount: result.count,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating matches:', error);
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

        const result = await deleteMatchBulk(ids);

        return NextResponse.json(
            {
                message: `Successfully deleted ${result.count} matches.`,
                deletedCount: result.count,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting matches:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
