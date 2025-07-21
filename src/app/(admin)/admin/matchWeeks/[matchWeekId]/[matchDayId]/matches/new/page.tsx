import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';
import { getAllPlayers } from '@/lib/services/player';

import Link from 'next/link';
import CreateMatchForm from '@/components/admin/matches/CreateForm';

interface AdminMatchesPageType {
    searchParams: Promise<{
        filterByCategory?: string;
    }>;
    params: Promise<{
        matchWeekId: string;
        matchDayId: string;
    }>;
}

export default async function AdminMatchesCreatePage({ searchParams, params }: AdminMatchesPageType) {
    const categories = await getAllCategories();
    const clubs = await getAllClubs();
    const { matchDayId, matchWeekId } = await params;
    const { filterByCategory = String(categories[0].id) } = await searchParams;

    const { players } = await getAllPlayers({
        categoryId: Number(filterByCategory),
    });

    return (
        <div className="md:p-6">
            <div className="flex justify-center gap-4 mb-8">
                <Link
                    href={`/admin/matchWeeks/${matchWeekId}/${matchDayId}/matches`}
                    className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md bg-white text-apur-green cursor-pointer`}
                >
                    Partidos
                </Link>
                <span
                    className={`cursor-default font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md bg-apur-green text-white`}
                >
                    Crear partido
                </span>
            </div>
            <div className="w-full md:w-7/10 mx-auto">
                <CreateMatchForm
                    players={players}
                    categories={categories}
                    clubs={clubs}
                    selectedCategory={filterByCategory}
                    matchDayId={Number(matchDayId)}
                />
            </div>
        </div>
    );
}
