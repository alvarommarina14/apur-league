'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from '@formkit/tempo';
import Link from 'next/link';
import { Pencil, X, Share } from 'lucide-react';

import { MatchWeekWithMatchDaysType } from '@/types/matchWeek';
import { ClubWithCourtsType } from '@/types/club';

import { deleteMatchDayAction, createMatchDayAction } from '@/lib/actions/matchDay';

import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

import { pdf } from '@react-pdf/renderer';
import { MatchWeekPDF } from '@/components/admin/pdf/MatchWeekPDF';
import { getMatchWeekWithMatchesAction } from '@/lib/actions/matchWeek';

import { showErrorToast } from '@/components/Toast';

interface MatchWeekCardEditableProp {
    week: MatchWeekWithMatchDaysType;
    clubs: ClubWithCourtsType[];
}

interface DateToDeleteType {
    id: string | number;
    date: string;
}

export default function MatchWeekCardEditable({ week, clubs }: MatchWeekCardEditableProp) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [dateToDelete, setDateToDelete] = useState<DateToDeleteType | null>(null);

    const handleRemoveDay = (day: DateToDeleteType) => {
        setDateToDelete(day);
        setIsOpen(true);
    };

    const handleDelete = async () => {
        if (!dateToDelete) return;
        await deleteMatchDayAction(String(dateToDelete.id));
        setIsOpen(false);
        router.refresh();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            matchWeekId: week.id,
            date: new Date(newDate).toISOString(),
        };
        await createMatchDayAction(formData);
        router.refresh();
    };

    const exportMatchWeekToPDF = async () => {
        const matchWeekWithMatches = await getMatchWeekWithMatchesAction(week.id);
        if (!matchWeekWithMatches) {
            showErrorToast('Error al intentar descargar la fecha, intente nuevamente.');
            return;
        }

        const apurMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
            ...day,
            matches: day.matches.filter((match) => match.court.club.name === 'APUR'),
        }));

        const palosVerdesMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
            ...day,
            matches: day.matches.filter((match) => match.court.club.name === 'PALOS VERDES'),
        }));

        const talleresMatchDays = matchWeekWithMatches!.matchDays.map((day) => ({
            ...day,
            matches: day.matches.filter((match) => match.court.club.name === 'TALLERES'),
        }));

        const blob = await pdf(
            <MatchWeekPDF
                clubCourts={clubs}
                apurMatches={apurMatchDays}
                palosVerdesMatches={palosVerdesMatchDays}
                talleresMatches={talleresMatchDays}
            />
        ).toBlob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Fecha-${week.name}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition min-h-[130px]">
            <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`absolute top-4 right-4 transition p-2 rounded-full cursor-pointer ${isEditing ? 'text-apur-green bg-gray-100 hover:bg-apur-lightGreen' : 'text-gray-500 hover:text-apur-green hover:bg-gray-100'}`}
            >
                {isEditing ? <X size={18} /> : <Pencil size={18} />}
            </button>

            <h2 className="text-xl font-semibold text-neutral-700 mb-4 uppercase">{week.name}</h2>

            <div className="flex flex-wrap gap-3">
                {week.matchDays.map((day) => {
                    const dateStr = format({ date: day.date, format: 'DD/MM/YYYY', tz: 'UTC' });

                    return (
                        <div key={day.id} className="relative">
                            {!isEditing ? (
                                <Link
                                    href={`/admin/matchWeeks/${week.id}/${day.id}/matches`}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-apur-green text-sm font-medium text-apur-green bg-white hover:bg-apur-green hover:text-white transition"
                                >
                                    <time dateTime={dateStr}>{dateStr}</time>
                                </Link>
                            ) : (
                                <div className="cursor-default inline-flex items-center justify-center px-4 py-2 rounded-full border border-apur-green text-sm font-medium text-apur-green bg-white">
                                    <time dateTime={dateStr}>{dateStr}</time>
                                </div>
                            )}

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveDay({
                                            id: day.id,
                                            date: dateStr,
                                        })
                                    }
                                    className="absolute -top-3 -right-2 cursor-pointer bg-red-800 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
                    <label className="block text-sm font-medium text-gray-700">Agregar día:</label>
                    <div className="flex items-center justify-between gap-4 flex-wrap 2xl:flex-nowrap">
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                        />
                        <button
                            type="submit"
                            disabled={!newDate}
                            className={`${!newDate ? 'opacity-30' : 'cursor-pointer hover:bg-apur-green-hover'} w-full font-semibold bg-apur-green text-white text-sm px-3 py-2 rounded-md transition`}
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            )}
            {isOpen && (
                <Modal
                    onClose={() => {
                        setIsOpen(false);
                    }}
                >
                    <ConfirmModal
                        entity={'la fecha'}
                        entityItem={dateToDelete ? format(dateToDelete?.date, 'DD/MM/YYYY') : ''}
                        onClose={() => setIsOpen(false)}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
            <button
                onClick={() => exportMatchWeekToPDF()}
                className={`absolute bottom-4 right-4 transition p-2 rounded-full cursor-pointer hover:text-apur-green hover:bg-gray-100  ${isEditing ? 'hidden' : 'text-gray-500'}`}
            >
                <Share size={18} />
            </button>
        </div>
    );
}
