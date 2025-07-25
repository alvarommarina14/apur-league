'use server';
import { createMatchDay } from '@/lib/services/matchDay';
import { deleteMatchDay } from '@/lib/services/matchDay';

export async function createMatchDayAction(data: { matchWeekId: number; date: string }) {
    try {
        return await createMatchDay(data);
    } catch (error) {
        throw error;
    }
}

export async function deleteMatchDayAction(id: number) {
    try {
        return await deleteMatchDay(id);
    } catch (error) {
        throw error;
    }
}
