'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import {
    mapOptions,
    getSelectedOption,
    buildQueryParams,
} from '@/lib/helpers/utils';

import { CategoryType } from '@/types/category';
import { PlayerType } from '@/types/player';
import { ClubWithCourtsType } from '@/types/club';

import CustomSelect from '@/components/CustomSelect';
import { PlayerSelects } from '@/lib/helpers/players/playerSelectHelper';

type CreateMatchFormProps = {
    players: PlayerType[];
    categories: CategoryType[];
    clubs: ClubWithCourtsType[];
    selectedCategory: string;
};

export default function CreateMatchForm({
    categories,
    players,
    clubs,
    selectedCategory: selectedCategoryProp,
}: CreateMatchFormProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [type, setType] = useState<'SINGLES' | 'DOUBLES'>('SINGLES');
    const [selectedCategory, setSelectedCategory] = useState(
        selectedCategoryProp ?? ''
    );
    const [team1Players, setTeam1Players] = useState<(string | null)[]>([
        '',
        '',
    ]);
    const [team2Players, setTeam2Players] = useState<(string | null)[]>([
        '',
        '',
    ]);
    const [selectedClub, setSelectedClub] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

    const categoryOptions = useMemo(
        () =>
            mapOptions(
                categories,
                (cat) => String(cat.id),
                (cat) => cat.name
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

    const courtOptions = useMemo(() => {
        const club = clubs.find((c) => String(c.id) === selectedClub);
        return club
            ? mapOptions(
                  club.courts,
                  (court) => String(court.id),
                  (court) => court.name
              )
            : [];
    }, [clubs, selectedClub]);
    const selectedCourtOption = useMemo(
        () => getSelectedOption(courtOptions, selectedCourt),
        [courtOptions, selectedCourt]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                filterByCategory: selectedCategory,
            });

            router.replace(
                `${pathname}${queryString ? '?' + queryString : ''}`
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [selectedCategory, pathname, router]);

    return (
        <form className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
            </label>
            <CustomSelect
                value={selectedCategoryOption}
                options={categoryOptions}
                setValue={setSelectedCategory}
                instanceId="category"
                placeholder="Seleccionar categoria"
            />

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de partido
                </label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setType('SINGLES')}
                        className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                            type === 'SINGLES'
                                ? 'bg-apur-green text-white'
                                : 'bg-white text-apur-green cursor-pointer'
                        }`}
                    >
                        Singles
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('DOUBLES')}
                        className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                            type === 'DOUBLES'
                                ? 'bg-apur-green text-white'
                                : 'bg-white text-apur-green cursor-pointer'
                        }`}
                    >
                        Dobles
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
                <PlayerSelects
                    teamLabel="Equipo 1"
                    teamPlayers={team1Players}
                    setTeamPlayers={setTeam1Players}
                    otherTeamPlayers={team2Players}
                    players={players}
                    type={type}
                    isDisabled={!selectedCategoryOption}
                />

                <PlayerSelects
                    teamLabel="Equipo 2"
                    teamPlayers={team2Players}
                    setTeamPlayers={setTeam2Players}
                    otherTeamPlayers={team1Players}
                    players={players}
                    type={type}
                    isDisabled={!selectedCategoryOption}
                />
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">
                Club
            </label>
            <CustomSelect
                value={selectedClubOption}
                options={clubOptions}
                setValue={setSelectedClub}
                instanceId="club"
                placeholder="Seleccionar club"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">
                Cancha
            </label>
            <CustomSelect
                value={selectedCourtOption}
                options={courtOptions}
                setValue={setSelectedCourt}
                instanceId="court"
                isDisabled={!selectedClub}
                placeholder="Seleccionar cancha"
            />
        </form>
    );
}
