'use client';
import { ChevronUp, ChevronDown } from 'lucide-react';

import { PlayerCategoryStatsPromotionsType } from '@/types/stats';

import Link from 'next/link';
import PlayerCardRanking from '@/components/players/PlayerCardRanking';
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
                            <th className="px-6 py-4 text-left rounded-tl-2xl whitespace-nowrap">Rank.</th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">Jugador</th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">Partidos jugados</th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">Partidos ganados</th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">Diff sets +/-</th>
                            <th className="px-6 py-4 text-left whitespace-nowrap">Diff games +/-</th>
                            <th className="px-6 py-4 text-left rounded-tr-2xl whitespace-nowrap">Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-neutral-500">
                                    No se encontraron jugadores para esta categoria
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
                                                    {row.isDemoting && <ChevronDown className="w-4 h-4 text-red-600" />}
                                                </span>
                                                <span className="font-bold">{index + 1}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`players/${row.playerId}`} className="hover:underline">
                                                {row.firstName + ' ' + row.lastName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{row.matchesPlayed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{row.matchesWon}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{row.diffSets}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{row.diffGames}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{row.points}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 mt-8 sm:hidden px-4">
                {rows.map((row, index) => {
                    return <PlayerCardRanking key={row.playerId} row={row} index={index} />;
                })}
            </div>
        </>
    );
}
