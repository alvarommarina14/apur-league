'use server';
import { MatchCreateInputType, MatchUpdateInputType, MatchUpdateInputWithIdType } from '@/types/matches';
import {
    updateMatchBulkService,
    createMatchBulkService,
    createMatchService,
    deleteMatchBulkService,
    updateMatchService,
    deleteMatchService,
} from '@/lib/services/matches';

export async function createMatch(data: MatchCreateInputType) {
    return await createMatchService(data);
}

export async function createMatchBulk(data: MatchCreateInputType[]) {
    return await createMatchBulkService(data);
}

export async function updateMatch(id: number, data: MatchUpdateInputType) {
    return await updateMatchService(Number(id), data);
}

export async function updateMatchBulk(data: MatchUpdateInputWithIdType[]) {
    return await updateMatchBulkService(data);
}

export async function deleteMatch(id: number) {
    return await deleteMatchService(Number(id));
}

export async function deleteMatchBulk(ids: number[]) {
    return await deleteMatchBulkService(ids);
}
