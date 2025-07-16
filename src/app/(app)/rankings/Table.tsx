import { ChevronUp, ChevronDown } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { PlayerWithPoints } from '@/types/points';

interface RankingTableProps {
    rows: PlayerWithPoints[];
    page: number;
    totalPages: number;
}

export async function RankingTable({
    rows,
    page,
    totalPages,
}: RankingTableProps) {
    return (
        <div className="w-full sm:w-[60%] mx-auto mt-8">
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm hidden sm:block">
                <table className="text-sm min-w-full text-neutral-800 table-fixed">
                    <thead>
                        <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide">
                            <th className="w-1/10 px-6 py-4 text-left rounded-tl-2xl">
                                Rank.
                            </th>
                            <th className="w-3/10 px-6 py-4 text-left">
                                Jugador
                            </th>
                            <th className="w-2/10 px-6 py-4 text-left">Edad</th>
                            <th className="w-2/10 px-6 py-4 text-left">
                                Partidos jugados
                            </th>
                            <th className="w-2/10 px-6 py-4 text-left rounded-tr-2xl">
                                Puntos
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-neutral-500"
                                >
                                    No se encontraron jugadores para esta
                                    categoria
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => {
                                let rowBgClass = '';
                                if (index < 2) {
                                    rowBgClass = 'bg-green-100';
                                } else if (index >= rows.length - 2) {
                                    rowBgClass = 'bg-red-100';
                                }

                                return (
                                    <tr key={row.id} className={rowBgClass}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="w-4 h-4 flex items-center justify-center">
                                                    {index < 2 ? (
                                                        <ChevronUp className="w-4 h-4 text-green-700" />
                                                    ) : index >=
                                                      rows.length - 2 ? (
                                                        <ChevronDown className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <ChevronUp className="w-4 h-4 opacity-0" />
                                                    )}
                                                </span>
                                                <span className="font-bold">
                                                    {index +
                                                        1 +
                                                        (page - 1) * 50}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {row.firstName + ' ' + row.lastName}
                                        </td>
                                        <td className="px-6 py-4">{row.age}</td>
                                        <td className="px-6 py-4">
                                            {row.matchesInCategory}
                                        </td>
                                        <td className="px-6 py-4">
                                            {row.points}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td
                                colSpan={5}
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
                </table>
            </div>

            <div className="flex flex-col gap-4 sm:hidden">
                {rows.map((row, index) => {
                    let bgClass = '';
                    if (index < 2) {
                        bgClass = 'bg-green-100';
                    } else if (index >= rows.length - 2) {
                        bgClass = 'bg-red-100';
                    }

                    return (
                        <div
                            key={row.id}
                            className={`rounded-xl border border-gray-200 p-4 shadow-sm ${bgClass}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 flex items-center justify-center">
                                        {index < 2 ? (
                                            <ChevronUp className="w-4 h-4 text-green-700" />
                                        ) : index >= rows.length - 2 ? (
                                            <ChevronDown className="w-4 h-4 text-red-600" />
                                        ) : (
                                            <ChevronUp className="w-4 h-4 opacity-0" />
                                        )}
                                    </span>
                                    <span className="font-bold text-neutral-800">
                                        {index + 1 + (page - 1) * 50}
                                    </span>
                                </div>
                                <span className="text-neutral-800 font-semibold">
                                    {row.points} pts
                                </span>
                            </div>
                            <div className="text-neutral-800 text-base font-medium">
                                {row.firstName} {row.lastName}
                            </div>
                            <div className="text-neutral-600 text-sm mt-1">
                                Edad: {row.age} <br />
                                Partidos jugados: {row.matchesInCategory}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
