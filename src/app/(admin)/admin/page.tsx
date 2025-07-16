import Image from 'next/image';

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
                <h5>Admin page</h5>
            </div>
        </div>
    );
}
