interface ScoreViewerProps {
    result: string;
    winnerTeam?: string;
}

export default function ScoreViewer({ result, winnerTeam }: ScoreViewerProps) {
    const setPairs = result.split(' ').map((s) => s.split('/'));
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
}
