import { NextResponse } from 'next/server';

import { createMatchWeek } from '@/lib/services/matchWeek';

export async function POST() {
    try {
        const newMatchWeek = await createMatchWeek();

        return NextResponse.json(
            {
                message: `Successfully created match week`,
                data: newMatchWeek,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating match week:', error);
        return NextResponse.json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
}
