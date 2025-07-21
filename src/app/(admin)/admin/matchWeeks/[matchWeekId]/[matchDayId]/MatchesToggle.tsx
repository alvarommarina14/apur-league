'use client';

import { useState } from 'react';

import { format } from '@formkit/tempo';

import { PlayerType } from '@/types/player';
import { CategoryType } from '@/types/category';
import { ClubWithCourtsType } from '@/types/club';
import { MatchDayWithMatchesType } from '@/types/matchDay';

import CreateForm from '@/components/admin/matches/CreateForm';
import MatchCardEditable from '@/components/admin/matches/MatchCardEditable';
import Filters from '@/components/Filters';

interface MatchesToggleProps {
    players: PlayerType[];
    categories: CategoryType[];
    clubs: ClubWithCourtsType[];
    selectedCategory: string;
    selectedMatchWeek: string;
    selectedMatchDay: MatchDayWithMatchesType;
    search?: string;
}

export default function MatchesToggle({
    players,
    categories,
    clubs,
    selectedCategory,
    selectedMatchWeek,
    selectedMatchDay,
    search,
}: MatchesToggleProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="w-full">
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setShowForm(false)}
                    className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                        !showForm
                            ? 'bg-apur-green text-white'
                            : 'bg-white text-apur-green cursor-pointer'
                    }`}
                >
                    Partidos
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                        showForm
                            ? 'bg-apur-green text-white'
                            : 'bg-white text-apur-green cursor-pointer'
                    }`}
                >
                    Formulario
                </button>
            </div>

            {showForm ? (
                <div className="w-full md:w-7/10 mx-auto">
                    <CreateForm
                        players={players}
                        categories={categories}
                        clubs={clubs}
                        selectedCategory={selectedCategory}
                        matchDayId={selectedMatchDay.id}
                    />
                </div>
            ) : (
                <section>
                    <div className="mb-10 lg:mb-4 flex flex-col lg:flex-row justify-between lg:items-center">
                        <h2 className="mb-4 lg:mb-0 text-center lg:text-left text-xl font-semibold text-neutral-700">
                            <time
                                dateTime={format(
                                    selectedMatchDay.date,
                                    'DD/MM/YYYY',
                                    'es'
                                )}
                            >
                                {format(
                                    selectedMatchDay.date,
                                    'MMMM D, YYYY',
                                    'es'
                                )}
                            </time>
                        </h2>
                        <Filters
                            categories={categories}
                            clubs={clubs}
                            search={search}
                            searchPlaceholder="Buscar por nombre o apellido..."
                            withSearch={true}
                            selectedCategory={selectedCategory}
                            selectedMatchWeek={selectedMatchWeek}
                        />
                    </div>

                    {selectedMatchDay.matches.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No hay partidos en este día.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
                            {selectedMatchDay.matches.map((match) => (
                                <MatchCardEditable
                                    key={match.id}
                                    match={match}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}
