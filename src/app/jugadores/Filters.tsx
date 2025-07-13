'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Select from 'react-select';

interface Category {
    id: number;
    name: string;
}

interface FiltersProps {
    categories: Category[];
    search?: string;
    selectedCategory?: string;
    sortOrder?: 'asc' | 'desc';
}

const sortOrderOptions = [
    { value: 'asc', label: 'Ordenar: A-Z' },
    { value: 'desc', label: 'Ordenar: Z-A' },
];

export default function Filters({
    categories,
    search: searchProp,
    selectedCategory: selectedCategoryProp,
    sortOrder: sortOrderProp,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(
        selectedCategoryProp ?? ''
    );
    const [sortOrder, setSortOrder] = useState(sortOrderProp ?? 'asc');

    const options = useMemo(
        () => [
            { value: '', label: 'Todas las categorías' },
            ...categories.map((cat) => ({
                value: cat.name,
                label: cat.name,
            })),
        ],
        [categories]
    );

    const selectedOption = useMemo(
        () => options.find((o) => o.value === selectedCategory) || options[0],
        [options, selectedCategory]
    );

    const selectedSortOrderOption = useMemo(
        () =>
            sortOrderOptions.find((o) => o.value === sortOrder) ||
            sortOrderOptions[0],
        [sortOrder]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            if (search) params.set('search', search);
            if (selectedCategory)
                params.set('filterByCategory', selectedCategory);
            if (sortOrder) params.set('sortOrder', sortOrder);

            router.replace(
                `${pathname}${params.toString() ? '?' + params.toString() : ''}`
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
                <Select
                    instanceId="filters-select-category"
                    value={selectedOption}
                    options={options}
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
                        input: () => 'text-gray-900',
                        dropdownIndicator: () => 'text-gray-500 px-2',
                        indicatorSeparator: () => 'bg-gray-300',
                    }}
                />
            </div>

            <div className="w-full sm:w-48">
                <Select
                    instanceId="filters-select-sortorder"
                    value={selectedSortOrderOption}
                    options={sortOrderOptions}
                    closeMenuOnSelect
                    onChange={(option) => {
                        if (
                            option?.value === 'asc' ||
                            option?.value === 'desc'
                        ) {
                            setSortOrder(option.value);
                        } else {
                            setSortOrder('asc');
                        }
                    }}
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
                        input: () => 'text-gray-900',
                        dropdownIndicator: () => 'text-gray-500 px-2',
                        indicatorSeparator: () => 'bg-gray-300',
                    }}
                />
            </div>
        </div>
    );
}
