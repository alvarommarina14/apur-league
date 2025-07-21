'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { OptionType } from '@/types/forms';
import { CategoryType } from '@/types/category';
import { MatchWeekType } from '@/types/matchWeek';
import { ClubType } from '@/types/club';

import { mapOptions, getSelectedOption, buildQueryParams } from '@/lib/helpers/utils';

import CustomSelect from '@/components/CustomSelect';
import Search from '@/components/Search';

interface FiltersProps {
    categories?: CategoryType[];
    matchWeeks?: MatchWeekType[];
    clubs?: ClubType[];
    search?: string;
    searchPlaceholder?: string;
    withSearch?: boolean;
    selectedCategory?: string;
    selectedMatchWeek?: string;
    selectedClub?: string;
    withSort?: boolean;
    sortOrder?: 'asc' | 'desc';
    sortOrderOptions?: { value: string; label: string }[];
    showAllCategory?: boolean;
    showAllMatchWeek?: boolean;
    showAllClub?: boolean;
}

export default function Filters({
    categories,
    matchWeeks,
    clubs,
    search: searchProp,
    searchPlaceholder,
    withSearch = false,
    selectedCategory: selectedCategoryProp,
    selectedMatchWeek: selectedMatchWeekProp,
    selectedClub: selectedClubProp,
    withSort = false,
    sortOrder: sortOrderProp,
    sortOrderOptions,
    showAllCategory = false,
    showAllMatchWeek = false,
    showAllClub = false,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp ?? '');
    const [selectedMatchWeek, setSelectedMatchWeek] = useState(selectedMatchWeekProp ?? '');
    const [selectedClub, setSelectedClub] = useState(selectedClubProp ?? '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
        withSort ? (sortOrderProp ?? 'asc') : undefined
    );

    const matchWeekOptions = useMemo(
        () =>
            mapOptions(
                matchWeeks ?? [],
                (w) => String(w.id),
                (w) => w.name,
                showAllMatchWeek,
                'Todas las fechas'
            ),
        [matchWeeks, showAllMatchWeek]
    );
    const selectedMatchWeekOption = useMemo(
        () => getSelectedOption(matchWeekOptions, selectedMatchWeek),
        [matchWeekOptions, selectedMatchWeek]
    );

    const categoryOptions = useMemo(
        () =>
            mapOptions(
                categories ?? [],
                (cat) => String(cat.id),
                (cat) => cat.name,
                showAllCategory,
                'Todas las categorías'
            ),
        [categories, showAllCategory]
    );
    const selectedCategoryOption = useMemo(
        () => getSelectedOption(categoryOptions, selectedCategory),
        [categoryOptions, selectedCategory]
    );

    const clubOptions = useMemo(
        () =>
            mapOptions(
                clubs ?? [],
                (c) => String(c.id),
                (c) => c.name,
                showAllClub,
                'Todas las sedes'
            ),
        [clubs, showAllClub]
    );
    const selectedClubOption = useMemo(() => getSelectedOption(clubOptions, selectedClub), [clubOptions, selectedClub]);

    const selectedSortOrderOption = useMemo(() => {
        if (!withSort || !sortOrderOptions) return null;
        return getSelectedOption(sortOrderOptions, sortOrder ?? null);
    }, [withSort, sortOrder, sortOrderOptions]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                search,
                filterByCategory: selectedCategory,
                filterByMatchWeek: selectedMatchWeek,
                filterByClub: selectedClub,
                ...(withSort && sortOrder ? { sortOrder } : {}),
            });

            router.replace(`${pathname}${queryString ? '?' + queryString : ''}`);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedCategory, selectedMatchWeek, selectedClub, sortOrder, pathname, router, withSort]);

    return (
        <>
            {withSearch && <Search placeholder={searchPlaceholder} value={search} setValue={setSearch} />}
            {matchWeeks && (
                <div className="w-full xl:min-w-56">
                    <CustomSelect
                        value={selectedMatchWeekOption}
                        options={matchWeekOptions}
                        onChange={(newValue) => {
                            setSelectedMatchWeek((newValue as OptionType | null)?.value ?? '');
                        }}
                        instanceId="matchweek"
                    />
                </div>
            )}
            {categories && (
                <div className="w-full xl:min-w-56">
                    <CustomSelect
                        value={selectedCategoryOption}
                        options={categoryOptions}
                        onChange={(newValue) => {
                            setSelectedCategory((newValue as OptionType | null)?.value ?? '');
                        }}
                        instanceId="category"
                    />
                </div>
            )}
            {clubs && (
                <div className="w-full xl:min-w-56">
                    <CustomSelect
                        value={selectedClubOption}
                        options={clubOptions}
                        onChange={(newValue) => {
                            setSelectedClub((newValue as OptionType | null)?.value ?? '');
                        }}
                        instanceId="club"
                    />
                </div>
            )}
            {withSort && sortOrderOptions && (
                <div className="w-full xl:min-w-56">
                    <CustomSelect
                        value={selectedSortOrderOption}
                        options={sortOrderOptions}
                        instanceId="sortorder"
                        onChange={(option) => setSortOrder((option as OptionType)?.value === 'asc' ? 'asc' : 'desc')}
                    />
                </div>
            )}
        </>
    );
}
