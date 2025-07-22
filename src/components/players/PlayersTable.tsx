import { PlayerType } from '@/types/player';

import { Trash, Pencil } from 'lucide-react';

import Link from 'next/link';
import Pagination from '@/components/Pagination';
import CategoryTag from '@/components/CategoryTag';
import PlayerCard from '@/components/players/PlayerCard';

interface PlayersTableProps {
    rows: PlayerType[];
    page: number;
    totalPages: number;
    isEditable?: boolean;
    cardsMobile?: boolean;
}

export default function PlayersTable({
    rows,
    page,
    totalPages,
    isEditable = false,
    cardsMobile = false,
}: PlayersTableProps) {
    const generateCell = (id: string | number, val: string) => {
        return isEditable ? (
            <span className="block w-full h-full px-4 py-3 truncate">{val}</span>
        ) : (
            <Link href={`/players/${id}`} className="block w-full h-full px-4 py-3 truncate">
                {val}
            </Link>
        );
    };

    return (
        <div>
            <div
                className={`${cardsMobile && 'hidden md:block'} w-full overflow-x-auto mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm`}
            >
                <table className="min-w-full text-sm text-neutral-800">
                    <thead>
                        <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide">
                            <th className="px-4 py-3 text-left rounded-tl-2xl">Apellido</th>
                            <th className="px-4 py-3 text-left">Nombre</th>
                            <th className={`px-4 py-3 text-left ${!isEditable && 'rounded-tr-2xl'}`}>Categoría</th>
                            {isEditable && (
                                <th className="px-4 py-3 rounded-tr-2xl text-center">
                                    <span className="px-4 py-3 text-center">Acciones</span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={isEditable ? 4 : 3} className="text-center py-6 text-neutral-500">
                                    No se encontraron jugadores
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors duration-200 hover:bg-apur-lightGreen border-b border-neutral-100 last:border-b-0"
                                >
                                    <td>{generateCell(row.id, row.lastName)}</td>
                                    <td>{generateCell(row.id, row.firstName)}</td>
                                    <td>
                                        {isEditable ? (
                                            <div className="w-full h-full px-4 py-3 flex flex-wrap gap-1">
                                                {row.playerCategories?.map((pcat) => (
                                                    <CategoryTag key={pcat.categoryId} category={pcat.category?.name} />
                                                ))}
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/players/${row.id}`}
                                                className="w-full h-full px-4 py-3 flex flex-wrap gap-1"
                                            >
                                                {row.playerCategories?.map((pcat) => (
                                                    <CategoryTag key={pcat.categoryId} category={pcat.category?.name} />
                                                ))}
                                            </Link>
                                        )}
                                    </td>
                                    {isEditable && (
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/players/edit/${row.id}`}
                                                    className="hover:bg-apur-green hover:text-white rounded-full p-2 transition"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <Link
                                                    href={`/players/${row.id}`}
                                                    className="hover:bg-red-200 hover:text-red-700 rounded-full p-2 transition"
                                                >
                                                    <Trash size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                    {rows.length > 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan={isEditable ? 4 : 3} className="px-4 py-3 border-t border-gray-200">
                                    <div className="flex justify-center">
                                        <Pagination page={page} totalPages={totalPages} />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            {cardsMobile && (
                <div className="md:hidden mt-6">
                    {rows.length === 0 ? (
                        <div>
                            <span className="text-center py-6 text-neutral-500">No se encontraron jugadores</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {rows.map((row) => (
                                <PlayerCard key={row.id} row={row} isEditable={isEditable} />
                            ))}
                        </div>
                    )}
                    {rows.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <div className="flex justify-center">
                                <Pagination page={page} totalPages={totalPages} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
