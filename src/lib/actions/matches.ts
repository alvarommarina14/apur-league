import {
    MatchCreateInputType,
    MatchUpdateInputType,
    MatchUpdateInputWithIdType,
} from '@/types/matches';

export async function createMatch(data: MatchCreateInputType) {
    return await fetch('api/matches', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function createMatchBulk(data: MatchCreateInputType[]) {
    return await fetch('api/matches', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateMatch(id: number, data: MatchUpdateInputType) {
    return await fetch(`api/matches/'${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function updateMatchBulk(data: MatchUpdateInputWithIdType[]) {
    return await fetch('api/matches', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteMatch(id: number) {
    return await fetch(`api/matches/${id}`, {
        method: 'DELETE',
    });
}

export async function deleteMatchBulk(ids: number[]) {
    return await fetch('api/matches', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
    });
}
