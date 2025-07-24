import { PlayerCategoryStatsPromotionsType } from '@/types/stats';

import { ChevronUp, ChevronDown } from 'lucide-react';

import Link from 'next/link';

interface PlayerCardRankingType {
    row: PlayerCategoryStatsPromotionsType;
    index: number;
}

export default function PlayerCardRanking({ row, index }: PlayerCardRankingType) {
    const bgClass = row.isPromoting ? 'bg-green-100' : row.isDemoting ? 'bg-red-100' : 'bg-white';

    return (
        <Link
            href={`players/${row.playerId}`}
            key={row.id}
            className={`rounded-xl border border-gray-200 p-4 shadow-sm ${bgClass}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-0">
                    <span className="text-2xl font-extrabold text-neutral-800 w-8 text-center">{index + 1}</span>
                    <div className="w-6 h-6 flex items-center justify-center">
                        {row.isPromoting && <ChevronUp className="w-5 h-5 text-green-600 animate-bounce-up" />}
                        {row.isDemoting && <ChevronDown className="w-5 h-5 text-red-500 animate-bounce-down" />}
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xl font-semibold text-neutral-900 leading-tight">
                        {row.firstName} {row.lastName}
                    </span>
                    <span className="text-lg font-bold text-apur-green leading-tight">{row.points} pts</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-neutral-600 text-sm border-t border-gray-100 pt-3 mt-3">
                <div className="col-span-2 text-base font-medium text-neutral-800 mb-1">Estadísticas:</div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Jugados:</span>
                    <span>{row.matchesPlayed}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Ganados:</span>
                    <span>{row.matchesWon}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Diff sets:</span>
                    <span>{row.diffSets}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Diff games:</span>
                    <span>{row.diffGames}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Puntos totales:</span>
                    <span>{row.points}</span>
                </div>
            </div>
        </Link>
    );
}
