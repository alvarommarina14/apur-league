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
}

export default function Filters({
    categories,
    search: searchProp,
    selectedCategory: selectedCategoryProp,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(
        selectedCategoryProp ?? ''
    );

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            if (search) params.set('search', search);
            if (selectedCategory)
                params.set('filterByCategory', selectedCategory);

            router.replace(
                `${pathname}${params.toString() ? '?' + params.toString() : ''}`
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedCategory, pathname, router]);

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
                            'z-50 rounded-md shadow-lg bg-white mt-2 border border-gray-300',
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
