'use server';
import { createMatchDay } from '@/lib/services/matchDay';
import { deleteMatchDay } from '@/lib/services/matchDay';

export async function createMatchDayAction(data: { matchWeekId: number; date: string }) {
    try {
        return await createMatchDay(data);
    } catch {
        throw new Error('No se pudo crear el dia seleccionado para la fecha: ' + data.date);
    }
}

export async function deleteMatchDayAction(id: string) {
    try {
        return await deleteMatchDay(Number(id));
    } catch {
        throw new Error('No se pudo eliminar el dia seleccionado');
    }
}
