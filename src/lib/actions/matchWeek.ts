'use server';
import { getMatchWeekWithMatches, createMatchWeek, deleteMatchWeek, getLastMatchWeek } from '@/lib/services/matchWeek';

export async function createMatchWeekAction() {
    try {
        const lastWeek = await getLastMatchWeek();
        if (lastWeek && lastWeek.matchDays.length === 0) {
            return {
                response: 'No se puede crear una nueva fecha hasta que la anterior tenga días cargados',
                success: false,
            };
        }
        const nextOrder = lastWeek ? lastWeek.order + 1 : 1;
        await createMatchWeek(nextOrder);
        return { success: true };
    } catch (error) {
        throw error;
    }
}

export async function getMatchWeekWithMatchesAction(matchWeekId: number) {
    try {
        const matchWeek = await getMatchWeekWithMatches({ matchWeekId });
        return { response: matchWeek, success: true };
    } catch (error) {
        throw error;
    }
}

export async function deleteMatchWeekAction(matchWeekId: number) {
    try {
        return await deleteMatchWeek({ matchWeekId });
    } catch (error) {
        throw error;
    }
}
