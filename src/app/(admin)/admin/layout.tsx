import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';

import Header from '@/components/Header';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Admin | Liga Tenis Apur',
    description: 'Administrador para gestionar las diferentes entidades de la liga',
    icons: {
        icon: '/logo-apur.png',
        shortcut: '/logo-apur.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Header />
                <main className="flex min-h-[calc(100dvh-4rem)]">
                    <Sidebar />
                    <Toaster />
                    <div className="flex-1 bg-neutral-100">{children}</div>
                </main>
            </body>
        </html>
    );
}
