'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { getPaginationPages } from '@/lib/helpers';

interface PaginationProps {
    page: number;
    totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function changePage(newPage: number) {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    }

    const pages = getPaginationPages(page, totalPages);

    return (
        <nav
            aria-label="Paginación"
            className="flex items-center justify-center gap-2 select-none"
        >
            <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="cursor-pointer p-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-apur-lightGreen transition"
                aria-label="Página anterior"
            >
                <ChevronLeft size={15} />
            </button>

            {pages.map((p, i) =>
                p === 'dots' ? (
                    <span
                        key={`dots-${i}`}
                        className="px-2 text-gray-500 select-none"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => changePage(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={`px-3 py-1 rounded-md border border-gray-300 transition ${
                            p === page
                                ? 'bg-apur-green text-white cursor-default'
                                : 'text-gray-700 hover:bg-apur-lightGreen cursor-pointer'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className="cursor-pointer p-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-apur-lightGreen transition"
                aria-label="Página siguiente"
            >
                <ChevronRight size={15} />
            </button>
        </nav>
    );
}
