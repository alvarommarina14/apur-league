'use server';
import { createMatchDay } from '@/lib/services/matchDay';
import { deleteMatchDay } from '@/lib/services/matchDay';
import { format } from '@formkit/tempo';

export async function createMatchDayAction(data: { matchWeekId: number; date: string }) {
    try {
        return await createMatchDay(data);
    } catch {
        throw new Error(
            'No se pudo crear el dia seleccionado para la fecha: ' +
                format({ date: data.date, format: 'DD/MM/YYYY', tz: 'UTC' })
        );
    }
}

export async function deleteMatchDayAction(id: number) {
    try {
        return await deleteMatchDay(id * 1000);
    } catch {
        throw new Error('No se pudo eliminar el dia seleccionado');
    }
}
