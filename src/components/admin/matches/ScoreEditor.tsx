import { isScoreValid } from '@/lib/helpers/utils';
interface ScoreEditorProps {
    score: string[][];
    onChange: (setIndex: number, teamIndex: number, value: string) => void;
}

export default function ScoreEditor({ score, onChange }: ScoreEditorProps) {
    const handleScoreChange = (setIndex: number, teamIndex: number, value: string) => {
        if (value !== '' && !/^[0-9]+$/.test(value)) return;

        const newValue = value === '' ? '' : parseInt(value, 10);

        if (newValue !== '') {
            if (setIndex < 2) {
                if (newValue > 7) return;
            } else {
                const opponentValueStr = score[setIndex]?.[1 - teamIndex] || '0';
                const opponentValue = opponentValueStr === '' ? 0 : parseInt(opponentValueStr, 10);

                if (newValue === 10 && opponentValue > 8 && opponentValue !== 12) return;
                if (opponentValue === 10 && newValue > 8 && newValue != 12) return;
            }
        }

        onChange(setIndex, teamIndex, newValue.toString());
    };

    return (
        <>
            {[0, 1].map((teamIndex) => (
                <div key={teamIndex} className="flex gap-1">
                    {[0, 1, 2].map((setIndex) => (
                        <input
                            key={setIndex}
                            type="text"
                            inputMode="numeric"
                            maxLength={setIndex === 2 ? 2 : 1}
                            className={`
                                w-6 text-center border rounded-sm p-1 focus:outline-none 
                                ${setIndex === 2 ? 'bg-yellow-50' : ''}
                                ${
                                    isScoreValid(setIndex, teamIndex, score)
                                        ? 'border-gray-300 focus:ring-apur-green focus:border-apur-green'
                                        : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                }
                            `}
                            value={score[setIndex]?.[teamIndex] ?? ''}
                            onChange={(e) => handleScoreChange(setIndex, teamIndex, e.target.value)}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}
