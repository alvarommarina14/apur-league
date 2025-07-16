import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Liga Tenis Apur',
    description:
        'Sitio web para ver y gestionar los calendarios de la liga de Apur',
    icons: {
        icon: '/logo-apur.png',
        shortcut: '/logo-apur.png',
    },
};

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <main>{children}</main>
            </body>
        </html>
    );
}
