'use server';
import { deletePlayerById, updatePlayerStatus } from '@/lib/services/player';

export async function updatePlayerStatusAction(id: number) {
    return await updatePlayerStatus(id);
}

export async function deletePlayerByIdAction(id: number) {
    return await deletePlayerById(id);
}
