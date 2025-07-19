import { getAllPlayers } from '@/lib/services/player';
import { getAllCategories } from '@/lib/services/category';
import { getAllClubs } from '@/lib/services/club';

import CreateForm from '@/components/admin/matches/CreateForm';
interface AdminMatchesPageType {
    searchParams: Promise<{
        filterByCategory?: string;
    }>;
}

export default async function AdminMatchesPage({
    searchParams,
}: AdminMatchesPageType) {
    const categories = await getAllCategories();
    const clubs = await getAllClubs();
    const { filterByCategory = String(categories[0].id) } = await searchParams;

    const { players } = await getAllPlayers({
        categoryId: Number(filterByCategory),
    });

    return (
        <div className="flex justify-center">
            <CreateForm
                players={players}
                categories={categories}
                clubs={clubs}
                selectedCategory={filterByCategory}
            />
        </div>
    );
}
