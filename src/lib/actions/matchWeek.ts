'use server';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';
import { createMatchWeek } from '@/lib/services/matchWeek';

export async function createMatchWeekAction() {
    return await createMatchWeek();
}

export async function getMatchWeekWithMatchesAction(matchWeekId: number) {
    return await getMatchWeekWithMatches({ matchWeekId });
}
