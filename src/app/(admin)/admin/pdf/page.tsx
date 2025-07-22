// app/pdf/page.tsx
import { getMatchWeekWithMatchesAction } from '@/lib/actions/matchWeek';
import { PdfViewerWrapper } from '@/components/admin/pdf/PDFViewerWrapper';

export default async function PdfPage() {
    const matchWeekWithMatches = await getMatchWeekWithMatchesAction(1);
    const apurMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
        ...day,
        matches: day.matches.filter((match) => match.court.club.name === 'APUR'),
    }));

    const palosVerdesMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
        ...day,
        matches: day.matches.filter((match) => match.court.club.name === 'PALOS VERDES'),
    }));

    const talleresMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
        ...day,
        matches: day.matches.filter((match) => match.court.club.name === 'TALLERES'),
    }));

    console.log(matchWeekWithMatches);
    console.log(apurMatchDays);
    console.log(palosVerdesMatchDays);
    console.log(talleresMatchDays);
    if (!matchWeekWithMatches) {
        return <div className="p-4 text-center">No match week data found</div>;
    }

    return (
        <div className="h-screen w-full">
            <PdfViewerWrapper
                apurMatches={apurMatchDays}
                palosVerdesMatches={palosVerdesMatchDays}
                talleresMatches={talleresMatchDays}
            />
        </div>
    );
}
