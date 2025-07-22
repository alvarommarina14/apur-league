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
    showAllCategory?: boolean;
    showAllMatchWeek?: boolean;
    showAllClub?: boolean;
    withStatus?: boolean;
    status?: 'activo' | 'inactivo';
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
    showAllCategory = false,
    showAllMatchWeek = false,
    showAllClub = false,
    withStatus = false,
    status: statusProp,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const sortOrderOptions = useMemo(() => {
        if (!withSort) return null;
        return [
            { value: 'asc', label: 'Ordenar: A-Z' },
            { value: 'desc', label: 'Ordenar: Z-A' },
        ];
    }, [withSort]);

    const statusOptions = useMemo(() => {
        if (!withStatus) return null;
        return [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
        ];
    }, [withStatus]);

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp ?? '');
    const [selectedMatchWeek, setSelectedMatchWeek] = useState(selectedMatchWeekProp ?? '');
    const [selectedClub, setSelectedClub] = useState(selectedClubProp ?? '');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
        withSort ? (sortOrderProp ?? 'asc') : undefined
    );

    const [status, setStatus] = useState<'activo' | 'inactivo' | undefined>(
        withStatus ? (statusProp ?? 'activo') : undefined
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

    const selectedStatusOption = useMemo(() => {
        if (!withStatus || !statusOptions) return null;
        return getSelectedOption(statusOptions, status ?? null);
    }, [withStatus, status, statusOptions]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                search,
                filterByCategory: selectedCategory,
                filterByMatchWeek: selectedMatchWeek,
                filterByClub: selectedClub,
                ...(withSort && sortOrder ? { sortOrder } : {}),
                ...(withStatus && status ? { status } : {}),
            });

            router.replace(`${pathname}${queryString ? '?' + queryString : ''}`);
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        search,
        selectedCategory,
        selectedMatchWeek,
        selectedClub,
        sortOrder,
        pathname,
        router,
        withSort,
        withStatus,
        status,
    ]);

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
            {withStatus && statusOptions && (
                <div className="w-full xl:min-w-56">
                    <CustomSelect
                        value={selectedStatusOption}
                        options={statusOptions}
                        instanceId="sortorder"
                        onChange={(option) =>
                            setStatus((option as OptionType)?.value === 'activo' ? 'activo' : 'inactivo')
                        }
                    />
                </div>
            )}
        </>
    );
}
