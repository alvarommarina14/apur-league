'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import Link from 'next/link';
import { Menu, X, House, Users, CalendarDays, LogOut } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const toggleSidebar = () => setOpen(!open);
    const closeSidebar = () => setOpen(false);

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="py-4 px-2 absolute top-1 z-50 md:hidden"
                aria-label="Abrir menú"
            >
                {open ? (
                    <X size={28} />
                ) : (
                    <Menu size={28} className="text-white" />
                )}
            </button>

            <aside
                className={`fixed top-0 left-0 min-h-full w-48 rounded-r-xl bg-neutral-200 z-40 transform transition-transform duration-300 md:translate-x-0 shadow-lg ${
                    open ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:block`}
            >
                <div className="h-full mt-16 md:mt-0 p-2 space-y-6">
                    <nav className="h-full flex flex-col justify-between">
                        <div>
                            <Link
                                href="/admin"
                                className={`${pathname === '/admin' && 'bg-neutral-100'} text-sm font-semibold flex items-center hover:bg-admin-grey-hover gap-4 p-2 rounded-md`}
                                onClick={closeSidebar}
                            >
                                <span>
                                    <House size={18} />
                                </span>
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/players"
                                className={`${pathname.startsWith('/admin/players') && 'bg-neutral-100'} text-sm font-semibold flex items-center hover:bg-admin-grey-hover gap-4 p-2 rounded-md`}
                                onClick={closeSidebar}
                            >
                                <span>
                                    <Users size={18} />
                                </span>
                                Jugadores
                            </Link>
                            <Link
                                href="/admin/matches"
                                className={`${pathname.startsWith('/admin/matches') && 'bg-neutral-100'} text-sm font-semibold flex items-center hover:bg-admin-grey-hover gap-4 p-2 rounded-md`}
                                onClick={closeSidebar}
                            >
                                <span>
                                    <CalendarDays size={18} />
                                </span>
                                Partidos
                            </Link>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className={`text-sm font-semibold flex items-center hover:bg-admin-grey-hover gap-4 p-2 rounded-md cursor-pointer`}
                        >
                            <span>
                                <LogOut size={18} />
                            </span>
                            Logout
                        </button>
                    </nav>
                </div>
            </aside>

            {open && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
                    onClick={closeSidebar}
                />
            )}
        </>
    );
}
