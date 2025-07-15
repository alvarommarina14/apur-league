import { Player } from '@/types/player';

import Link from 'next/link';
import Pagination from '@/components/Pagination';
interface PlayersTableProps {
    rows: Player[];
    page: number;
    totalPages: number;
}

export default function PlayersTable({
    rows,
    page,
    totalPages,
}: PlayersTableProps) {
    return (
        <div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm mt-8">
                <table className="min-w-full text-sm text-neutral-800 table-fixed">
                    <thead>
                        <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide">
                            <th className="w-1/3 px-6 py-4 text-left rounded-tl-2xl">
                                Apellido
                            </th>
                            <th className="w-1/3 px-6 py-4 text-left">
                                Nombre
                            </th>
                            <th className="w-1/3 px-6 py-4 text-left rounded-tr-2xl">
                                Categoría
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="text-center py-6 text-neutral-500"
                                >
                                    No se encontraron jugadores
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors duration-200 hover:bg-apur-lightGreen border-b border-neutral-100 last:border-b-0"
                                >
                                    <td>
                                        <Link
                                            href={`/players/${row.id}`}
                                            className="block w-full h-full px-6 py-4 font-medium text-neutral-900 truncate"
                                        >
                                            {row.lastName}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/players/${row.id}`}
                                            className="block w-full h-full px-6 py-4 truncate"
                                        >
                                            {row.firstName}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/players/${row.id}`}
                                            className="w-full h-full px-6 py-4 flex gap-2"
                                        >
                                            {row.playerCategories?.map(
                                                (pcat) => (
                                                    <span
                                                        key={pcat.categoryId}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${pcat.category.name === 'Sin categoria' ? 'bg-red-100 text-red-800 border border-red-400' : 'bg-yellow-100 text-yellow-800 border-apur-yellow'}  truncate`}
                                                    >
                                                        {pcat.category.name}
                                                    </span>
                                                )
                                            )}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {rows.length > 0 && (
                        <tfoot>
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-4 border-t border-gray-200"
                                >
                                    <div className="flex justify-center">
                                        <Pagination
                                            page={page}
                                            totalPages={totalPages}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
