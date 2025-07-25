'use server';
import { getMatchWeekWithMatches, createMatchWeek, deleteMatchWeek, getLastMatchWeek } from '@/lib/services/matchWeek';

export async function createMatchWeekAction() {
    try {
        const lastWeek = await getLastMatchWeek();

        if (lastWeek && lastWeek.matchDays.length === 0) {
            throw new Error('No se puede crear una nueva fecha hasta que la anterior tenga días cargados');
        }

        const nextOrder = lastWeek ? lastWeek.order + 1 : 1;

        return await createMatchWeek(nextOrder);
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
        matchWeekId = matchWeekId * 1000;
        return await deleteMatchWeek({ matchWeekId });
    } catch {
        throw new Error('Error al intentar eliminar una fecha');
    }
}
