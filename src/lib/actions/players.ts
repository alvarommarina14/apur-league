'use server';
import {
    deletePlayerById,
    updatePlayerStatus,
    updatePlayerData,
    createPlayer,
    getAllPlayers,
} from '@/lib/services/player';

export async function getAllPlayersAction(categoryId: number) {
    return await getAllPlayers({ categoryId });
}

export async function createPlayerAction(data: { firstName: string; lastName: string; categoryIds: number[] }) {
    return await createPlayer(data);
}

export async function updatePlayerDataAction(
    id: number,
    data: { firstName: string; lastName: string; categoryIds: number[] }
) {
    return await updatePlayerData(id, data);
}

export async function updatePlayerStatusAction(id: number, newStatus: boolean) {
    return await updatePlayerStatus(id, newStatus);
}

export async function deletePlayerByIdAction(id: number) {
    return await deletePlayerById(id);
}
