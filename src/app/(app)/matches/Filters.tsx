'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { CategoryType } from '@/types/category';
import { MatchWeekType } from '@/types/matchWeek';
import { ClubType } from '@/types/club';

import {
    mapOptions,
    getSelectedOption,
    buildQueryParams,
} from '@/lib/helpers/utils';

import CustomSelect from '@/components/CustomSelect';

interface FiltersProps {
    categories: CategoryType[];
    matchWeeks: MatchWeekType[];
    clubs: ClubType[];
    search?: string;
    selectedCategory?: string;
    selectedMatchWeek?: string;
    selectedClub?: string;
}

export default function Filters({
    categories,
    matchWeeks,
    clubs,
    search: searchProp,
    selectedCategory: selectedCategoryProp,
    selectedMatchWeek: selectedMatchWeekProp,
    selectedClub: selectedClubProp,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(
        selectedCategoryProp ?? ''
    );
    const [selectedMatchWeek, setSelectedMatchWeek] = useState(
        selectedMatchWeekProp ?? ''
    );
    const [selectedClub, setSelectedClub] = useState(selectedClubProp ?? '');

    const matchWeekOptions = useMemo(
        () =>
            mapOptions(
                matchWeeks,
                (w) => String(w.id),
                (w) => w.name
            ),
        [matchWeeks]
    );
    const selectedMatchWeekOption = useMemo(
        () => getSelectedOption(matchWeekOptions, selectedMatchWeek),
        [matchWeekOptions, selectedMatchWeek]
    );

    const categoryOptions = useMemo(
        () =>
            mapOptions(
                categories,
                (cat) => String(cat.id),
                (cat) => cat.name,
                true,
                'Todas las categorías'
            ),
        [categories]
    );
    const selectedCategoryOption = useMemo(
        () => getSelectedOption(categoryOptions, selectedCategory),
        [categoryOptions, selectedCategory]
    );

    const clubOptions = useMemo(
        () =>
            mapOptions(
                clubs,
                (c) => String(c.id),
                (c) => c.name
            ),
        [clubs]
    );
    const selectedClubOption = useMemo(
        () => getSelectedOption(clubOptions, selectedClub),
        [clubOptions, selectedClub]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                search,
                filterByCategory: selectedCategory,
                filterByMatchWeek: selectedMatchWeek,
                filterByClub: selectedClub,
            });

            router.replace(
                `${pathname}${queryString ? '?' + queryString : ''}`
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        search,
        selectedCategory,
        selectedMatchWeek,
        selectedClub,
        pathname,
        router,
    ]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-apur-green w-full sm:w-64"
            />
            <div className="w-full sm:w-64">
                <CustomSelect
                    value={selectedMatchWeekOption}
                    options={matchWeekOptions}
                    setValue={setSelectedMatchWeek}
                    instanceId="matchweek"
                />
            </div>
            <div className="w-full sm:w-64">
                <CustomSelect
                    value={selectedCategoryOption}
                    options={categoryOptions}
                    setValue={setSelectedCategory}
                    instanceId="category"
                />
            </div>
            <div className="w-full sm:w-64">
                <CustomSelect
                    value={selectedClubOption}
                    options={clubOptions}
                    setValue={setSelectedClub}
                    instanceId="club"
                />
            </div>
        </div>
    );
}
