'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Trash, Pencil } from 'lucide-react';

import { PlayerType } from '@/types/player';
import { updatePlayerStatusAction } from '@/lib/actions/players';

import { showSuccessToast } from '@/components/Toast';

import Link from 'next/link';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface PlayerCardProps {
    row: PlayerType;
    isEditable?: boolean;
}

export default function TableActionsButtons({ row }: PlayerCardProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const label = `${row.firstName} ${row.lastName}`;

    const handleDelete = async () => {
        setIsModalOpen(false);

        try {
            const response = await updatePlayerStatusAction(row.id);
            showSuccessToast(response.message);
            router.refresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Link
                href={`/admin/players/edit/${row.id}`}
                className="hover:bg-apur-green hover:text-white rounded-full p-2 transition"
            >
                <Pencil size={16} />
            </Link>
            <button
                onClick={() => setIsModalOpen(true)}
                className="hover:bg-red-200 hover:text-red-700 rounded-full p-2 transition cursor-pointer"
            >
                <Trash size={16} />
            </button>
            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                >
                    <ConfirmModal
                        entity={'el jugador'}
                        entityItem={label || ''}
                        onClose={() => setIsModalOpen(false)}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
        </>
    );
}
