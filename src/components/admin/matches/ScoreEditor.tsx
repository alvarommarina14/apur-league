interface ScoreEditorProps {
    score: string[][];
    onChange: (setIndex: number, teamIndex: number, value: string) => void;
}

export default function ScoreEditor({ score, onChange }: ScoreEditorProps) {
    return (
        <>
            {[0, 1].map((teamIndex) => (
                <div key={teamIndex} className="flex gap-1">
                    {[0, 1, 2].map((setIndex) => (
                        <input
                            key={setIndex}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-6 text-center border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-1 focus:ring-apur-green focus:border-apur-green"
                            value={score[setIndex]?.[teamIndex] || ''}
                            onChange={(e) =>
                                onChange(setIndex, teamIndex, e.target.value)
                            }
                        />
                    ))}
                </div>
            ))}
        </>
    );
}
