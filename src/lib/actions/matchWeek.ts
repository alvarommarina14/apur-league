'use server';
import { getMatchWeekWithMatches } from '@/lib/services/matchWeek';

export async function createMatchWeekAction() {
    return await fetch('/api/match-week', {
        method: 'POST',
    });
}

export async function getMatchWeekWithMatchesAction(matchWeekId: number) {
    return await getMatchWeekWithMatches({ matchWeekId });
}
