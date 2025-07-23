import { getAllMatchWeekWithMatchDays } from '@/lib/services/matchWeek';
import { getAllClubs } from '@/lib/services/club';

import MatchWeekCardEditable from '@/components/admin/matchWeek/MatchWeekCardEditable';
import CreateButton from '@/components/admin/matchWeek/CreateButton';

export default async function AdminMatchWeeksPage() {
    const matchWeeks = await getAllMatchWeekWithMatchDays();
    const clubCourts = await getAllClubs();

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Listado de Fechas</h1>
            <p className="text-center text-neutral-500 text-sm mt-2">Todas las fechas activas de la liga</p>
            <CreateButton />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                {matchWeeks.map((week) => (
                    <MatchWeekCardEditable key={week.id} week={week} clubs={clubCourts} />
                ))}
            </div>
        </div>
    );
}
