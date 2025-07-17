'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="w-full bg-neutral-900 text-white shadow-md h-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4">
                <Link
                    href="/"
                    className={`${pathname.includes('/admin') && 'ml-8'}`}
                >
                    <Image
                        src="/logo-apur.png"
                        alt="Logo de la liga"
                        width={200}
                        height={2000}
                        className="h-10 md:h-12 w-auto"
                    />
                </Link>

                <nav className="flex gap-6 text-sm sm:text-base font-medium">
                    <Link
                        href="/players"
                        className={`${pathname.startsWith('/players') && 'text-apur-yellow'} hover:text-yellow-400 transition-colors duration-200`}
                    >
                        Jugadores
                    </Link>
                    <Link
                        href="/matches"
                        className={`${pathname.startsWith('/matches') && 'text-apur-yellow'} hover:text-yellow-400 transition-colors duration-200`}
                    >
                        Partidos
                    </Link>
                    <Link
                        href="/rankings"
                        className={`${pathname.startsWith('/rankings') && 'text-apur-yellow'} hover:text-yellow-400 transition-colors duration-200`}
                    >
                        Rankings
                    </Link>
                </nav>
            </div>
        </header>
    );
}
