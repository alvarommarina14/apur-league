import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="relative">
            <Image
                src="/home-image.jpg"
                alt="Fondo de cancha de tenis"
                width={2000}
                height={200}
                priority
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 z-0" />
            <div className="relative min-h-[calc(100dvh-4rem)] z-10 flex flex-col items-center justify-center px-4 text-center gap-12">
                <Image
                    src="/logo-apur.png"
                    alt="Logo de la liga"
                    width={300}
                    height={300}
                    className="w-72 lg:w-96 h-auto"
                />

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Link
                        href="/jugadores"
                        className="w-full text-lg sm:text-xl px-6 py-3 rounded-xl font-semibold text-neutral-900 bg-yellow-300 transition-all duration-300 ease-in-out shadow-md hover:bg-yellow-400 hover:scale-105 hover:shadow-lg"
                    >
                        Jugadores
                    </Link>
                    <Link
                        href="/partidos"
                        className="w-full text-lg sm:text-xl px-6 py-3 rounded-xl font-semibold text-neutral-900 bg-yellow-300 transition-all duration-300 ease-in-out shadow-md hover:bg-yellow-400 hover:scale-105 hover:shadow-lg"
                    >
                        Partidos
                    </Link>
                    <Link
                        href="/partidos"
                        className="w-full text-lg sm:text-xl px-6 py-3 rounded-xl font-semibold text-neutral-900 bg-yellow-300 transition-all duration-300 ease-in-out shadow-md hover:bg-yellow-400 hover:scale-105 hover:shadow-lg"
                    >
                        Ranking (WIP)
                    </Link>
                </div>
            </div>
        </div>
    );
}
