import { Trash, Pencil } from 'lucide-react';
import Link from 'next/link';

import { PlayerType } from '@/types/player';
import CategoryTag from '@/components/CategoryTag';

interface PlayerCardProps {
    row: PlayerType;
    isEditable?: boolean;
}

export default function PlayerCard({ row, isEditable = false }: PlayerCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800">
                        {row.lastName} {row.firstName}
                    </h3>
                </div>
                {isEditable && (
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/players/edit/${row.id}`}
                            className="p-2 rounded-full hover:bg-apur-green hover:text-white text-gray-600 transition-colors"
                            title="Editar jugador"
                        >
                            <Pencil size={18} />
                        </Link>
                        <Link
                            href={`/players/${row.id}`}
                            className="p-2 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
                            title="Eliminar jugador"
                        >
                            <Trash size={18} />
                        </Link>
                    </div>
                )}
            </div>

            {row.playerCategories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {row.playerCategories.map((pcat) => (
                        <CategoryTag key={pcat.categoryId} category={pcat.category?.name} />
                    ))}
                </div>
            )}
        </div>
    );
}
