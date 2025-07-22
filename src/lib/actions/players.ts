'use server';
import { deletePlayerById, updatePlayerStatus, updatePlayerData, createPlayer } from '@/lib/services/player';

export async function createPlayerAction(data: { firstName: string; lastName: string; categoryIds: number[] }) {
    return await createPlayer(data);
}

export async function updatePlayerDataAction(
    id: number,
    data: { firstName: string; lastName: string; categoryIds: number[] }
) {
    return await updatePlayerData(id, data);
}

export async function updatePlayerStatusAction(id: number) {
    return await updatePlayerStatus(id);
}

export async function deletePlayerByIdAction(id: number) {
    return await deletePlayerById(id);
}
