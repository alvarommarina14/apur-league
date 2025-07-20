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

export const PlayerSelects: React.FC<PlayerSelectsProps> = ({
    teamLabel,
    teamPlayers,
    setTeamPlayers,
    otherTeamPlayers,
    players,
    type,
    isDisabled,
}) => {
    const playerMap = useMemo(
        () => new Map(players.map((p) => [String(p.id), p])),
        [players]
    );

    const getPlayerOption = (id: SelectValue) =>
        id && playerMap.has(id)
            ? {
                  label: `${playerMap.get(id)!.firstName} ${playerMap.get(id)!.lastName}`,
                  value: id,
              }
            : null;

    const numberOfPlayers = type === 'SINGLES' ? 1 : 2;

    return (
        <div>
            <h3 className="text-sm font-semibold mb-2">{teamLabel}</h3>
            {Array.from({ length: numberOfPlayers }).map((_, i) => {
                const usedValues = new Set(
                    [
                        ...teamPlayers.filter((_, idx) => idx !== i),
                        ...otherTeamPlayers,
                    ].filter(Boolean)
                );

                const options = [
                    {
                        label: 'Seleccionar jugador',
                        value: '',
                        isDisabled: true,
                    },
                    ...players.map((p) => ({
                        label: `${p.firstName} ${p.lastName}`,
                        value: String(p.id),
                        isDisabled: usedValues.has(String(p.id)),
                    })),
                ];

                return (
                    <div key={`${teamLabel}-player-${i}`} className="mb-2">
                        <CustomSelect
                            value={getPlayerOption(teamPlayers[i])}
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
