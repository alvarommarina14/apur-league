'use client';

import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { format } from '@formkit/tempo';

import { MatchWithPlayersAndCategoryType } from '@/types/matches';
import {
    parseResultToMatrix,
    isSameScore,
    determineWinner,
} from '@/lib/helpers/utils';

import ScoreEditor from '@/components/admin/matches/ScoreEditor';
import ScoreViewer from '@/components/admin/matches/ScoreViewer';
import CategoryTag from '@/components/CategoryTag';

interface Props {
    match: MatchWithPlayersAndCategoryType;
}

export default function MatchCard({ match }: Props) {
    const winnerTeam = match.playerMatches.find((pm) => pm.winner)?.team;
    const teams = {
        EQUIPO_1: match.playerMatches.filter((pm) => pm.team === 'EQUIPO_1'),
        EQUIPO_2: match.playerMatches.filter((pm) => pm.team === 'EQUIPO_2'),
    };

    const timeFormatted = format({
        date: new Date(match.hour),
        format: 'HH:mm',
        tz: 'UTC',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedScore, setEditedScore] = useState<string[][]>(() =>
        parseResultToMatrix(match.result ?? '', winnerTeam)
    );

    const originalScore = parseResultToMatrix(match.result ?? '', winnerTeam);
    const isScoreChanged = !isSameScore(editedScore, originalScore);

    const handleScoreChange = (
        setIndex: number,
        teamIndex: number,
        value: string
    ) => {
        setEditedScore((prev) => {
            const updated = prev.map((set, i) =>
                i === setIndex
                    ? [
                          ...set.slice(0, teamIndex),
                          value,
                          ...set.slice(teamIndex + 1),
                      ]
                    : set
            );
            return updated;
        });
    };

    const renderPlayers = (players: typeof match.playerMatches) => (
        <div className="flex items-center gap-2">
            <div className="flex space-x-1">
                {players.map((p) => {
                    const initials =
                        `${p.player.firstName[0]}${p.player.lastName[0]}`.toUpperCase();
                    return (
                        <div
                            key={p.player.id}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-apur-green text-white text-xs font-semibold flex items-center justify-center border border-apur-green"
                            title={`${p.player.firstName} ${p.player.lastName}`}
                        >
                            {initials}
                        </div>
                    );
                })}
            </div>
            <span className="text-sm md:text-base text-neutral-700 font-semibold">
                {players
                    .map((p) => `${p.player.firstName} ${p.player.lastName}`)
                    .join(' / ')}
            </span>
            {players.some((p) => p.winner) && (
                <Check className="w-4 h-4 text-green-600 ml-1" />
            )}
        </div>
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const computedWinner = determineWinner(editedScore);

        const cleanedResult = editedScore
            .filter(([a, b]) => a !== '' || b !== '')
            .map(([a, b]) =>
                computedWinner === 'EQUIPO_2' ? `${b}/${a}` : `${a}/${b}`
            )
            .join(' ');

        const updatedPlayerMatches = match.playerMatches.map((pm) => ({
            playerId: pm.playerId,
            matchId: match.id,
            winner: pm.team === computedWinner,
        }));

        const formData = {
            matchId: match.id,
            result: cleanedResult,
            playerMatches: updatedPlayerMatches,
        };

        console.log(formData);
        setIsEditing(false);
    };

    return (
        <div className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg w-full transition">
            <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`absolute top-1 right-1 transition p-2 rounded-full cursor-pointer hover:text-apur-green hover:bg-gray-100 ${isEditing ? 'text-apur-green bg-gray-100' : 'text-gray-500'}`}
            >
                <Pencil size={18} />
            </button>

            <div className="flex text-sm text-gray-700 font-medium mb-2">
                <span>
                    {match.court.club.name} - {match.court.name} -{' '}
                    {timeFormatted}
                </span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                <div className="flex flex-col gap-1">
                    {renderPlayers(teams.EQUIPO_1)}
                    {renderPlayers(teams.EQUIPO_2)}
                </div>
                {isEditing ? (
                    <form
                        id="edit-match-form"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-1 text-sm min-w-[3.5rem] items-end justify-between"
                    >
                        <ScoreEditor
                            score={editedScore}
                            onChange={handleScoreChange}
                        />
                    </form>
                ) : (
                    match.result && (
                        <ScoreViewer
                            result={match.result}
                            winnerTeam={winnerTeam}
                        />
                    )
                )}
            </div>

            <div className="mt-3 flex justify-between items-center">
                <CategoryTag category={match.category?.name} />
                {isEditing && (
                    <button
                        form="edit-match-form"
                        type="submit"
                        disabled={!isScoreChanged}
                        className={`bg-apur-green text-white px-3 py-2 rounded-md ${isScoreChanged ? ' hover:bg-apur-green-hover cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
                    >
                        Guardar
                    </button>
                )}
            </div>
        </div>
    );
}
