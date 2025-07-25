'use server';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';
import { createMatchWeek } from '@/lib/services/matchWeek';
import { revalidatePath } from 'next/cache';

export async function createMatchWeekAction() {
    try {
        revalidatePath('/admin/matchWeeks');
        return await createMatchWeek();
    } catch (error) {
        throw error;
    }
}

export async function getMatchWeekWithMatchesAction(matchWeekId: number) {
    try {
        revalidatePath('/admin/matchWeeks');
        return await getMatchWeekWithMatches({ matchWeekId });
    } catch {
        throw new Error('Error al obtener datos de la fecha');
    }
}
