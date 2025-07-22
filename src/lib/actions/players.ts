'use server';
import { deletePlayerById } from '@/lib/services/player';

export async function deletePlayerByIdAction(id: number) {
    return await deletePlayerById(id);
}
