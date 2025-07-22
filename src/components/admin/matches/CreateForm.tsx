'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { mapOptions, getSelectedOption, buildQueryParams } from '@/lib/helpers/utils';

import hoursOptions from '@/seed/hours.json';

import { OptionType } from '@/types/forms';
import { CategoryType } from '@/types/category';
import { PlayerType } from '@/types/player';
import { ClubWithCourtsType } from '@/types/club';
import { MatchModeType } from '@/types/matches';

import CustomSelect from '@/components/CustomSelect';
import { PlayerSelects } from '@/lib/helpers/players/playerSelectHelper';
import { createMatchAction } from '@/lib/actions/matches';
import { showErrorToast, showSuccessToast } from '@/components/Toast';
import { hourToDefaultUTCDate } from '@/lib/helpers/utils';

type CreateMatchFormProps = {
    players: PlayerType[];
    categories: CategoryType[];
    clubs: ClubWithCourtsType[];
    selectedCategory: string;
    matchDayId: number;
};

export default function CreateMatchForm({
    categories,
    players,
    clubs,
    selectedCategory: selectedCategoryProp,
    matchDayId,
}: CreateMatchFormProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [type, setType] = useState<MatchModeType>('SINGLES');
    const [selectedCategory, setSelectedCategory] = useState(String(selectedCategoryProp) ?? '');
    const [team1Players, setTeam1Players] = useState<(string | null)[]>(['', '']);
    const [team2Players, setTeam2Players] = useState<(string | null)[]>(['', '']);
    const [selectedClub, setSelectedClub] = useState<string | null>(null);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedHour, setSelectedHour] = useState<string>('');

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

    const selectedClubOption = useMemo(() => getSelectedOption(clubOptions, selectedClub), [clubOptions, selectedClub]);

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

    const selectedHourOption = useMemo(() => getSelectedOption(hoursOptions, selectedHour), [selectedHour]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryString = buildQueryParams({
                filterByCategory: selectedCategory,
            });

            router.replace(`${pathname}${queryString ? '?' + queryString : ''}`);
        }, 300);

        return () => clearTimeout(timeout);
    }, [selectedCategory, pathname, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            type,
            categoryId: Number(selectedCategory),
            courtId: Number(selectedCourt),
            hour: hourToDefaultUTCDate(selectedHour),
            matchDayId: matchDayId,
        };
        try {
            await createMatchAction(
                formData,
                team1Players.filter((p) => !!p).map(Number),
                team2Players.filter((p) => !!p).map(Number)
            );
            showSuccessToast('Partido creado exitosamente');
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                showErrorToast(error.message.split('Error:')[1]);
            } else {
                showErrorToast('An unexpected error occurred');
            }
        } finally {
            setType('SINGLES');
            setSelectedCategory('');
            setTeam1Players(['', '']);
            setTeam2Players(['', '']);
            setSelectedClub(null);
            setSelectedCourt(null);
            setSelectedHour('');
        }
    };

    const expectedPlayers = type === 'SINGLES' ? 1 : 2;

    const isFormValid =
        !!selectedCategory &&
        !!selectedClub &&
        !!selectedCourt &&
        !!selectedHour &&
        team1Players.slice(0, expectedPlayers).every((p) => p) &&
        team2Players.slice(0, expectedPlayers).every((p) => p);

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-xl shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <CustomSelect
                value={selectedCategoryOption}
                options={categoryOptions}
                onChange={(newValue) => {
                    setSelectedCategory((newValue as OptionType | null)?.value ?? '');
                }}
                instanceId="category"
                placeholder="Seleccionar categoria"
            />
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de partido</label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setType('SINGLES')}
                        className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                            type === 'SINGLES' ? 'bg-apur-green text-white' : 'bg-white text-apur-green cursor-pointer'
                        }`}
                    >
                        Singles
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('DOUBLES')}
                        className={`font-semibold px-6 py-2 rounded border border-apur-green hover:bg-apur-green hover:border-apur-green hover:text-white transition shadow-md ${
                            type === 'DOUBLES' ? 'bg-apur-green text-white' : 'bg-white text-apur-green cursor-pointer'
                        }`}
                    >
                        Dobles
                    </button>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 mt-4">
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
            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">Club</label>
            <CustomSelect
                value={selectedClubOption}
                options={clubOptions}
                onChange={(newValue) => {
                    setSelectedClub((newValue as OptionType | null)?.value ?? null);
                }}
                instanceId="club"
                placeholder="Seleccionar club"
            />
            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">Cancha</label>
            <CustomSelect
                value={selectedCourtOption}
                options={courtOptions}
                onChange={(newValue) => {
                    setSelectedCourt((newValue as OptionType | null)?.value ?? null);
                }}
                instanceId="court"
                isDisabled={!selectedClub}
                placeholder="Seleccionar cancha"
            />

            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">Hora</label>
            <CustomSelect
                value={selectedHourOption}
                options={hoursOptions}
                onChange={(newValue) => {
                    setSelectedHour((newValue as OptionType)?.value ?? null);
                }}
                instanceId="hour"
                placeholder="Seleccionar horario"
            />
            <div className="mt-8 flex justify-end w-full">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`font-semibold px-6 py-2 rounded border transition shadow-md border-apur-green bg-apur-green text-white ${isFormValid ? 'cursor-pointer hover:bg-apur-green-hover hover:border-apur-green-hover' : 'opacity-30 cursor-not-allowed'}`}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
