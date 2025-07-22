'use client';
import { PDFViewer } from '@react-pdf/renderer';
import { MatchWeekPDF } from '@/components/admin/pdf/MatchWeekPDF';
import { MatchDayWithMatchesType } from '@/types/matchDay';

interface Props {
    apurMatches: MatchDayWithMatchesType[];
    palosVerdesMatches: MatchDayWithMatchesType[];
    talleresMatches: MatchDayWithMatchesType[];
}

export function PDFViewerLocal({ apurMatches, palosVerdesMatches, talleresMatches }: Props) {
    return (
        <PDFViewer className="w-full h-screen">
            <MatchWeekPDF
                apurMatches={apurMatches!}
                palosVerdesMatches={palosVerdesMatches!}
                talleresMatches={talleresMatches!}
            />
        </PDFViewer>
    );
}
