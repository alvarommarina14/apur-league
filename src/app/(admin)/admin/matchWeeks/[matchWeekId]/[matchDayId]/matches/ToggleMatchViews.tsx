'use client';
import { useState } from 'react';

import { format } from '@formkit/tempo';

import Filters from '@/components/Filters';
import MatchCardEditable from '@/components/admin/matches/MatchCardEditable';
import CreateMatchForm from '@/components/admin/matches/CreateForm';
import { CategoryType } from '@/types/category';
import { ClubWithCourtsType } from '@/types/club';
import { MatchDayWithMatchesType } from '@/types/matchDay';

interface ToggleMatchViewsType {
    selectedMatchWeekId: string;
    matchDay: MatchDayWithMatchesType;
    categories: CategoryType[];
    clubs: ClubWithCourtsType[];
    search?: string;
    selectedCategory?: string;
    selectedClub: string;
    matchDayId: number;
}

export default function ToggleMatchViews({
    selectedMatchWeekId,
    matchDay,
    categories,
    clubs,
    search,
    selectedCategory,
    selectedClub,
    matchDayId,
}: ToggleMatchViewsType) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="md:p-6">
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setShowForm(false)}
                    className={`w-44 font-semibold px-6 py-2 rounded border transition shadow-md ${
                        showForm
                            ? 'bg-white text-apur-green border-apur-green hover:bg-apur-green hover:text-white cursor-pointer'
                            : 'bg-apur-green text-white border-apur-green cursor-default'
                    }`}
                >
                    Partidos
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className={`w-44 font-semibold px-6 py-2 rounded border transition shadow-md ${
                        showForm
                            ? 'bg-apur-green text-white border-apur-green cursor-default'
                            : 'bg-white text-apur-green border-apur-green hover:bg-apur-green hover:text-white cursor-pointer'
                    }`}
                >
                    Crear partido
                </button>
            </div>
            <section className={`${showForm && 'hidden'}`}>
                <div className="mb-10 lg:mb-4 flex flex-col lg:flex-row justify-between lg:items-center">
                    <h2 className="mb-4 lg:mb-0 text-center lg:text-left text-xl font-semibold text-neutral-700">
                        <time dateTime={format(matchDay.date, 'DD/MM/YYYY', 'es')}>
                            {format(matchDay.date, 'MMMM D, YYYY', 'es')}
                        </time>
                    </h2>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Filters
                            categories={categories}
                            clubs={clubs}
                            search={search}
                            searchPlaceholder="Buscar por nombre o apellido..."
                            withSearch={true}
                            selectedCategory={selectedCategory}
                            selectedMatchWeek={selectedMatchWeekId}
                            selectedClub={selectedClub}
                            showAllClub
                            showAllCategory
                        />
                    </div>
                </div>

                {matchDay.matches.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay partidos en este día.</p>
                ) : (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
                        {matchDay.matches.map((match) => (
                            <MatchCardEditable key={match.id} match={match} />
                        ))}
                    </ul>
                )}
            </section>
            <section className={`w-full md:w-7/10 mx-auto ${!showForm && 'hidden'}`}>
                <CreateMatchForm categories={categories} clubs={clubs} matchDayId={matchDayId} />
            </section>
        </div>
    );
}
