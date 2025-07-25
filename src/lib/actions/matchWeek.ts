'use server';
import { getMatchWeekWithMatches, createMatchWeek, deleteMatchWeek } from '@/lib/services/matchWeek';

export async function createMatchWeekAction() {
    try {
        return await createMatchWeek();
    } catch (error) {
        throw error;
    }
}

export async function getMatchWeekWithMatchesAction(matchWeekId: number) {
    try {
        return await getMatchWeekWithMatches({ matchWeekId });
    } catch {
        throw new Error('Error al obtener datos de la fecha');
    }
}

export async function deleteMatchWeekAction(matchWeekId: number) {
    try {
        return await deleteMatchWeek({ matchWeekId });
    } catch {
        throw new Error('Error al intentar eliminar una fecha');
    }
}
