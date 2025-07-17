import { format } from '@formkit/tempo';
import { Check } from 'lucide-react';
import { MatchWithPlayersAndCategoryType } from '@/types/matches';

import CategoryTag from '@/components/CategoryTag';

interface Props {
    match: MatchWithPlayersAndCategoryType;
}

export default function MatchCard({ match }: Props) {
    const teams = {
        EQUIPO_1: match.playerMatches.filter((pm) => pm.team === 'EQUIPO_1'),
        EQUIPO_2: match.playerMatches.filter((pm) => pm.team === 'EQUIPO_2'),
    };

    const winnerTeam = match.playerMatches.find((pm) => pm.winner)?.team;

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
            <span className="text-sm md:text-base  text-neutral-700 font-semibold">
                {players
                    .map((p) => `${p.player.firstName} ${p.player.lastName}`)
                    .join(' / ')}
            </span>
            {players.some((p) => p.winner) && (
                <Check className="w-4 h-4 text-green-600 ml-1" />
            )}
        </div>
    );

    const renderScore = () => {
        if (!match.result) return null;
        // return (
        //     <div className="flex flex-col gap-1 text-sm min-w-[3.5rem] items-end justify-between">
        //         pending
        //     </div>
        // );

        const sets = match.result.split(' ');
        const setPairs = sets.map((set) => set.split('/'));

        const scoreTeam1 = setPairs.map((s) =>
            winnerTeam === 'EQUIPO_2' ? s[1] : s[0]
        );
        const scoreTeam2 = setPairs.map((s) =>
            winnerTeam === 'EQUIPO_2' ? s[0] : s[1]
        );

        return (
            <div className="flex flex-col gap-1 text-sm min-w-[3.5rem] items-end justify-between">
                <div className="flex gap-1">
                    {scoreTeam1.map((s, i) => (
                        <span key={i} className="w-5 text-center">
                            {s}
                        </span>
                    ))}
                </div>
                <div className="flex gap-1">
                    {scoreTeam2.map((s, i) => (
                        <span key={i} className="w-5 text-center">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const timeFormatted = format({
        date: new Date(match.hour),
        format: 'HH:mm',
        tz: 'UTC',
    });

    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md w-full sm:max-w-lg">
            <div className="flex justify-between text-sm text-gray-700 font-medium mb-2">
                <span>APUR - Cancha {match.court.replace('CANCHA_', '')}</span>
                <span>{timeFormatted}</span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                <div className="flex flex-col gap-1">
                    {renderPlayers(teams.EQUIPO_1)}
                    {renderPlayers(teams.EQUIPO_2)}
                </div>
                {renderScore()}
            </div>
            <div className="mt-3">
                <CategoryTag category={match.category?.name} />
            </div>
        </div>
    );
}
