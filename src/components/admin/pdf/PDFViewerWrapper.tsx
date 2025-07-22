// components/PdfViewerWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
// import { MatchWeekWithMatches } from '@/types'; // Adjust import based on your types
import { MatchDayWithMatchesType } from '@/types/matchDay';

const PDFViewerLocal = dynamic(() => import('@/components/admin/pdf/PDFViewer').then((mod) => mod.PDFViewerLocal), {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading PDF viewer...</div>,
});

interface Props {
    apurMatches: MatchDayWithMatchesType[];
    palosVerdesMatches: MatchDayWithMatchesType[];
    talleresMatches: MatchDayWithMatchesType[];
}

export function PdfViewerWrapper({ apurMatches, palosVerdesMatches, talleresMatches }: Props) {
    return (
        <PDFViewerLocal
            apurMatches={apurMatches}
            palosVerdesMatches={palosVerdesMatches}
            talleresMatches={talleresMatches}
        />
    );
}
