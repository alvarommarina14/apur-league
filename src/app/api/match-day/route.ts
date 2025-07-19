import { NextResponse, NextRequest } from 'next/server';

import { createMatchDay } from '@/lib/services/matchDay';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const result = await createMatchDay(data);

        return NextResponse.json(
            {
                message: `Successfully created match day.`,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating match day:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
