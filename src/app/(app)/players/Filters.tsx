'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { CategoryType } from '@/types/category';
import {
    mapOptions,
    getSelectedOption,
    buildQueryParams,
} from '@/lib/helpers/utils';

import CustomSelect from '@/components/CustomSelect';

interface FiltersProps {
    categories: CategoryType[];
    search?: string;
    selectedCategory?: string;
    sortOrder?: 'asc' | 'desc';
    sortOrderOptions: { value: string; label: string }[];
}

export default function Filters({
    categories,
    search: searchProp,
    selectedCategory: selectedCategoryProp,
    sortOrder: sortOrderProp,
    sortOrderOptions,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(
        selectedCategoryProp ?? ''
    );
    const [sortOrder, setSortOrder] = useState(sortOrderProp ?? 'asc');

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

    const selectedSortOrderOption = useMemo(
        () => getSelectedOption(sortOrderOptions, sortOrder),
        [sortOrder, sortOrderOptions]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                search,
                filterByCategory: selectedCategory,
                sortOrder,
            });

            router.replace(
                `${pathname}${queryString ? '?' + queryString : ''}`
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedCategory, sortOrder, pathname, router]);

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
                    value={selectedCategoryOption}
                    options={categoryOptions}
                    setValue={setSelectedCategory}
                    instanceId="players-category"
                />
            </div>

            <div className="w-full sm:w-48">
                <CustomSelect
                    value={selectedSortOrderOption}
                    options={sortOrderOptions}
                    setValue={() => {}}
                    instanceId="sortorder"
                    onChangeExtra={(option) =>
                        setSortOrder(option?.value === 'asc' ? 'asc' : 'desc')
                    }
                />
            </div>
        </div>
    );
}
