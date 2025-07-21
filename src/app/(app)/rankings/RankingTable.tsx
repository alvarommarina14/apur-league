'use client';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { PlayerCategoryStatsPromotionsType } from '@/types/stats';
interface RankingTableProps {
    rows: PlayerCategoryStatsPromotionsType[];
}

export function RankingTable({ rows }: RankingTableProps) {
    return (
        <>
            <div className="w-full mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm hidden sm:block">
                <table className="min-w-full text-neutral-800 table-auto sm:table-fixed text-sm">
                    <thead>
                        <tr className="bg-apur-green text-xs font-semibold text-white uppercase tracking-wide rounded-t-2xl">
                            <th className="px-6 py-4 text-left rounded-tl-2xl whitespace-nowrap">
                                Rank.
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Jugador
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Edad
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Partidos jugados
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Partidos ganados
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Diff sets +/-
                            </th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">
                                Diff games +/-
                            </th>
                            <th className="px-6 py-4 text-left rounded-tr-2xl whitespace-nowrap">
                                Puntos
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-6 text-neutral-500"
                                >
                                    No se encontraron jugadores para esta
                                    categoria
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => {
                                const rowBgClass = row.isPromoting
                                    ? 'bg-green-100'
                                    : row.isDemoting
                                      ? 'bg-red-100'
                                      : '';

                                return (
                                    <tr key={index} className={rowBgClass}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <span className="w-4 h-4 flex items-center justify-center">
                                                    {row.isPromoting && (
                                                        <ChevronUp className="w-4 h-4 text-green-700" />
                                                    )}
                                                    {row.isDemoting && (
                                                        <ChevronDown className="w-4 h-4 text-red-600" />
                                                    )}
                                                </span>
                                                <span className="font-bold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.firstName + ' ' + row.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.age}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.matchesPlayed}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.matchesWon}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.diffSets}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.diffGames}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {row.points}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 mt-8 sm:hidden px-4">
                {rows.map((row, index) => {
                    const bgClass = row.isPromoting
                        ? 'bg-green-50'
                        : row.isDemoting
                          ? 'bg-red-50'
                          : 'bg-white';

                    return (
                        <div
                            key={row.id}
                            className={`rounded-xl border border-gray-200 p-4 shadow-sm ${bgClass}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-0">
                                    <span className="text-2xl font-extrabold text-neutral-800 w-8 text-center">
                                        {index + 1}
                                    </span>
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {row.isPromoting && (
                                            <ChevronUp className="w-5 h-5 text-green-600 animate-bounce-up" />
                                        )}
                                        {row.isDemoting && (
                                            <ChevronDown className="w-5 h-5 text-red-500 animate-bounce-down" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-semibold text-neutral-900 leading-tight">
                                        {row.firstName} {row.lastName}
                                    </span>
                                    <span className="text-lg font-bold text-apur-green leading-tight">
                                        {row.points} pts
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-neutral-600 text-sm border-t border-gray-100 pt-3 mt-3">
                                <div className="col-span-2 text-base font-medium text-neutral-800 mb-1">
                                    Estadísticas:
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Edad:</span>
                                    <span>
                                        {row.age !== null ? row.age : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Jugados:
                                    </span>
                                    <span>{row.matchesPlayed}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Ganados:
                                    </span>
                                    <span>{row.matchesWon}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Diff sets:
                                    </span>
                                    <span>{row.diffSets}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Diff games:
                                    </span>
                                    <span>{row.diffGames}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Puntos totales:
                                    </span>
                                    <span>{row.points}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
