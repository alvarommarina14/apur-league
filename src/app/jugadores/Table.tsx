import { Player } from '@/types/player';

import Link from 'next/link';

interface PlayersTableProps {
    players: Player[];
}

export default function PlayersTable({ players }: PlayersTableProps) {
    const rows = players.flatMap((player) =>
        player.playerCategories.map((cat, j) => ({
            key: `${player.id}-${j}`,
            id: player.id,
            lastName: player.lastName,
            firstName: player.firstName,
            categoryName: cat.category.name,
        }))
    );

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm mt-8">
            <table className="min-w-full text-sm text-neutral-800 table-fixed">
                <thead>
                    <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide">
                        <th className="w-1/3 px-6 py-4 text-left rounded-tl-2xl">
                            Apellido
                        </th>
                        <th className="w-1/3 px-6 py-4 text-left">Nombre</th>
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
                                key={row.key}
                                className="transition-colors duration-200 hover:bg-apur-lightGreen border-b border-neutral-100 last:border-b-0"
                            >
                                <td>
                                    <Link
                                        href={`/jugadores/${row.id}`}
                                        className="block w-full h-full px-6 py-4 font-medium text-neutral-900 truncate"
                                    >
                                        {row.lastName}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        href={`/jugadores/${row.id}`}
                                        className="block w-full h-full px-6 py-4 truncate"
                                    >
                                        {row.firstName}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        href={`/jugadores/${row.id}`}
                                        className="block w-full h-full px-6 py-4 truncate"
                                    >
                                        {row.categoryName}
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
