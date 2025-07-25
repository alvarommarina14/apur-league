import { PlayerType } from '@/types/player';
import CategoryTag from '@/components/CategoryTag';
import TableActionsButtons from '@/components/players/TableActionsButtons';
import Link from 'next/link';

interface PlayerCardProps {
    row: PlayerType;
    isEditable?: boolean;
}

export default function PlayerCard({ row, isEditable = false }: PlayerCardProps) {
    const renderCardContent = () => {
        return (
            <>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-800">
                            {row.lastName} {row.firstName}
                        </h3>
                    </div>
                    {isEditable && (
                        <div className="flex gap-2">
                            <TableActionsButtons row={row} />
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
            </>
        );
    };
    return isEditable ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full hover:shadow-md transition-shadow">
            {renderCardContent()}
        </div>
    ) : (
        <Link
            href={`players/${row.id}`}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 w-full hover:shadow-md transition-shadow"
        >
            {renderCardContent()}
        </Link>
    );
}
