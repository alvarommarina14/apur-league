import { useMemo } from 'react';
import { PlayerType } from '@/types/player';
import CustomSelect from '@/components/CustomSelect';

type SelectValue = string | null;

interface PlayerSelectsProps {
    teamLabel: string;
    teamPlayers: SelectValue[];
    setTeamPlayers: (players: SelectValue[]) => void;
    otherTeamPlayers: SelectValue[];
    players: PlayerType[];
    type: 'SINGLES' | 'DOUBLES';
    isDisabled?: boolean;
}

const getPlayerOption = (
    players: PlayerType[],
    id: SelectValue
): { label: string; value: string } | null => {
    if (!id) return null;
    const player = players.find((p) => String(p.id) === id);
    if (!player) return null;
    return {
        label: `${player.firstName} ${player.lastName}`,
        value: String(player.id),
    };
};

const generatePlayerOptions = (
    players: PlayerType[],
    selected: SelectValue[],
    otherSelected: SelectValue[]
) => {
    const usedValues = new Set([...selected, ...otherSelected].filter(Boolean));
    return players.map((p) => {
        const value = String(p.id);
        return {
            label: `${p.firstName} ${p.lastName}`,
            value,
            isDisabled: usedValues.has(value),
        };
    });
};

export const PlayerSelects: React.FC<PlayerSelectsProps> = ({
    teamLabel,
    teamPlayers,
    setTeamPlayers,
    otherTeamPlayers,
    players,
    type,
    isDisabled,
}) => {
    const options = useMemo(() => {
        const opts = generatePlayerOptions(
            players,
            teamPlayers,
            otherTeamPlayers
        );
        return [
            { label: 'Seleccionar jugador', value: '', isDisabled: true },
            ...opts.map((o) =>
                teamPlayers.includes(o.value) ? { ...o, isDisabled: false } : o
            ),
        ];
    }, [players, teamPlayers, otherTeamPlayers]);

    return (
        <div>
            <h3 className="text-sm font-semibold mb-2">{teamLabel}</h3>
            {[0, 1].map((i) => {
                if (type === 'SINGLES' && i === 1) return null;

                return (
                    <div key={`${teamLabel}-player-${i}`} className="mb-2">
                        <CustomSelect
                            value={getPlayerOption(players, teamPlayers[i])}
                            options={options}
                            setValue={(val) => {
                                const updated = [...teamPlayers];
                                updated[i] = val !== '' ? val : null;
                                setTeamPlayers(updated);
                            }}
                            instanceId={`${teamLabel}-player-${i}`}
                            placeholder="Seleccionar jugador"
                            isDisabled={isDisabled}
                        />
                    </div>
                );
            })}
        </div>
    );
};
