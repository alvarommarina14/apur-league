'use server';
import { createMatchDay } from '@/lib/services/matchDay';
import { deleteMatchDay } from '@/lib/services/matchDay';

export async function createMatchDayAction(data: { matchWeekId: number; date: string }) {
    return await createMatchDay(data);
}

export async function deleteMatchDayAction(id: string) {
    return await deleteMatchDay(Number(id));
}
