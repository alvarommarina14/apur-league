'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { CategoryType } from '@/types/category';
import { MatchWeekType } from '@/types/matchWeek';
import Select from 'react-select';

interface FiltersProps {
    categories: CategoryType[];
    matchWeeks: MatchWeekType[];
    search?: string;
    selectedCategory?: string;
    selectedMatchWeek?: string;
}

export default function Filters({
    categories,
    matchWeeks,
    search: searchProp,
    selectedCategory: selectedCategoryProp,
    selectedMatchWeek: selectedMatchWeekProp,
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

    const categoryOptions = useMemo(
        () => [
            { value: '', label: 'Todas las categorías' },
            ...categories.map((cat) => ({
                value: String(cat.id),
                label: cat.name,
            })),
        ],
        [categories]
    );

    const selectedCategoryOption = useMemo(
        () =>
            categoryOptions.find((o) => o.value === selectedCategory) ||
            categoryOptions[0],
        [categoryOptions, selectedCategory]
    );

    const matchWeekOptions = useMemo(
        () => [
            ...matchWeeks.map((week) => ({
                value: String(week.id),
                label: week.name,
            })),
        ],
        [matchWeeks]
    );

    const selectedMatchWeekOption = useMemo(
        () =>
            matchWeekOptions.find((o) => o.value === selectedMatchWeek) ||
            matchWeekOptions[0],
        [matchWeekOptions, selectedMatchWeek]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            if (search) params.set('search', search);
            if (selectedCategory)
                params.set('filterByCategory', selectedCategory);
            if (selectedMatchWeek)
                params.set('filterByMatchWeek', selectedMatchWeek);

            router.replace(
                `${pathname}${params.toString() ? '?' + params.toString() : ''}`
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedCategory, selectedMatchWeek, pathname, router]);

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
                <Select
                    instanceId="filters-select-matchweek"
                    value={selectedMatchWeekOption}
                    options={matchWeekOptions}
                    closeMenuOnSelect
                    onChange={(option) =>
                        setSelectedMatchWeek(option?.value || '')
                    }
                    unstyled
                    classNames={{
                        control: ({ isFocused }) =>
                            `rounded-md border py-2 pl-4 focus-within:ring-1 focus-within:ring-apur-green ${
                                isFocused
                                    ? 'border-apur-green'
                                    : 'border-gray-300'
                            }`,
                        menu: () =>
                            'z-50 rounded-md shadow-lg bg-white mt-2 border border-gray-300 overflow-hidden',
                        option: ({ isFocused, isSelected }) =>
                            `cursor-pointer select-none px-4 py-2 ${
                                isFocused || isSelected
                                    ? 'bg-apur-green text-white'
                                    : 'text-gray-900'
                            }`,
                        singleValue: () => 'truncate',
                        input: () => 'text-gray-900 cursor-pointer',
                        dropdownIndicator: () =>
                            'text-gray-500 px-2 cursor-pointer',
                        indicatorSeparator: () => 'bg-gray-300',
                    }}
                />
            </div>
            <div className="w-full sm:w-64">
                <Select
                    instanceId="filters-select-category"
                    value={selectedCategoryOption}
                    options={categoryOptions}
                    closeMenuOnSelect
                    onChange={(option) =>
                        setSelectedCategory(option?.value || '')
                    }
                    unstyled
                    classNames={{
                        control: ({ isFocused }) =>
                            `rounded-md border py-2 pl-4 focus-within:ring-1 focus-within:ring-apur-green ${
                                isFocused
                                    ? 'border-apur-green'
                                    : 'border-gray-300'
                            }`,
                        menu: () =>
                            'z-50 rounded-md shadow-lg bg-white mt-2 border border-gray-300 overflow-hidden',
                        option: ({ isFocused, isSelected }) =>
                            `cursor-pointer select-none px-4 py-2 ${
                                isFocused || isSelected
                                    ? 'bg-apur-green text-white'
                                    : 'text-gray-900'
                            }`,
                        singleValue: () => 'truncate',
                        input: () => 'text-gray-900 cursor-pointer',
                        dropdownIndicator: () =>
                            'text-gray-500 px-2 cursor-pointer',
                        indicatorSeparator: () => 'bg-gray-300',
                    }}
                />
            </div>
        </div>
    );
}
