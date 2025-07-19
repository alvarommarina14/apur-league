'use client';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { PlayerCategoryStatsPromotionsType } from '@/types/stats';
interface RankingTableProps {
    rows: PlayerCategoryStatsPromotionsType[];
}

export function RankingTable({ rows }: RankingTableProps) {
    return (
        <>
            <div className="w-full sm:w-[90%] mx-auto mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm hidden sm:block">
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
                                if (row.isPromoting) {
                                    rowBgClass = 'bg-green-100';
                                } else if (row.isDemoting) {
                                    rowBgClass = 'bg-red-100';
                                }

                                return (
                                    <tr key={index} className={rowBgClass}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <span className="w-4 h-4 flex items-center justify-center">
                                                    {row.isPromoting ? (
                                                        <ChevronUp className="w-4 h-4 text-green-700" />
                                                    ) : row.isDemoting ? (
                                                        <ChevronDown className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <ChevronUp className="w-4 h-4 opacity-0" />
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
                    let bgClass = '';
                    if (row.isPromoting) {
                        bgClass = 'bg-green-100';
                    } else if (row.isDemoting) {
                        bgClass = 'bg-red-100';
                    }

                    return (
                        <div
                            key={index}
                            className={`rounded-xl border border-gray-200 p-4 shadow-sm ${bgClass}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 flex items-center justify-center">
                                        {row.isPromoting ? (
                                            <ChevronUp className="w-4 h-4 text-green-700" />
                                        ) : row.isDemoting ? (
                                            <ChevronDown className="w-4 h-4 text-red-600" />
                                        ) : (
                                            <ChevronUp className="w-4 h-4 opacity-0" />
                                        )}
                                    </span>
                                    <span className="font-bold text-neutral-800">
                                        {index + 1}
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
                                Partidos jugados: {row.matchesPlayed}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
