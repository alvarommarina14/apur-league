'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from '@formkit/tempo';
import Link from 'next/link';
import { Pencil, X } from 'lucide-react';

import { MatchWeekWithMatchDaysType } from '@/types/matchWeek';

import {
    deleteMatchDayAction,
    createMatchDayAction,
} from '@/lib/actions/matchDay';

import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface MatchWeekCardEditableProp {
    week: MatchWeekWithMatchDaysType;
}

interface DateToDeleteType {
    id: string | number;
    date: string;
}

export default function MatchWeekCardEditable({
    week,
}: MatchWeekCardEditableProp) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [dateToDelete, setDateToDelete] = useState<DateToDeleteType | null>(
        null
    );

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

    return (
        <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition min-h-[130px]">
            <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`absolute top-4 right-4 transition p-2 rounded-full cursor-pointer hover:text-apur-green hover:bg-gray-100  ${isEditing ? 'text-apur-green bg-gray-100' : 'text-gray-500'}`}
            >
                <Pencil size={18} />
            </button>

            <h2 className="text-xl font-semibold text-neutral-700 mb-4 uppercase">
                {week.name}
            </h2>

            <div className="flex flex-wrap gap-3">
                {week.matchDays.map((day) => {
                    const dateStr = format(day.date, 'YYYY-MM-DD');

                    return (
                        <div key={day.id} className="relative">
                            {!isEditing ? (
                                <Link
                                    href={`/admin/matchWeeks/${week.id}/${day.id}`}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-apur-green text-sm font-medium text-apur-green bg-white hover:bg-apur-green hover:text-white transition"
                                >
                                    <time dateTime={dateStr}>
                                        {format(day.date, 'DD/MM/YYYY', 'es')}
                                    </time>
                                </Link>
                            ) : (
                                <div className="cursor-default inline-flex items-center justify-center px-4 py-2 rounded-full border border-apur-green text-sm font-medium text-apur-green bg-white">
                                    <time dateTime={dateStr}>
                                        {format(day.date, 'DD/MM/YYYY', 'es')}
                                    </time>
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
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 mt-4"
                >
                    <label className="block text-sm font-medium text-gray-700">
                        Agregar día:
                    </label>
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
                        entityItem={dateToDelete?.date || ''}
                        onClose={() => setIsOpen(false)}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
        </div>
    );
}
