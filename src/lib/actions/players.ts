'use server';
import {
    deletePlayerById,
    updatePlayerStatus,
    updatePlayerData,
    createPlayer,
    getAllPlayers,
} from '@/lib/services/player';

export async function getAllPlayersAction(categoryId: number) {
    try {
        return await getAllPlayers({ categoryId });
    } catch {
        throw new Error('Error al obtener la informacion de los jugadores');
    }
}

export async function createPlayerAction(data: { firstName: string; lastName: string; categoryIds: number[] }) {
    try {
        return await createPlayer(data);
    } catch {
        throw new Error('No se pudo crear el jugador: ' + data.firstName + ' ' + data.lastName);
    }
}

export async function updatePlayerDataAction(
    id: number,
    data: { firstName: string; lastName: string; categoryIds: number[] }
) {
    try {
        return await updatePlayerData(id, data);
    } catch {
        throw new Error('Error al actualizar el jugador: ' + data.firstName + ' ' + data.lastName);
    }
}

export async function updatePlayerStatusAction(id: number, newStatus: boolean) {
    try {
        return await updatePlayerStatus(id, newStatus);
    } catch (error) {
        throw error;
    }
}

export async function deletePlayerByIdAction(id: number) {
    try {
        return await deletePlayerById(id);
    } catch {
        throw new Error('No se pudo eliminar el jugador');
    }
}
