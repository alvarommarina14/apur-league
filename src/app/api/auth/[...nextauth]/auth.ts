import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('Credenciales incorrectas');
                }

                const userFound = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!userFound) {
                    throw new Error('Usuario no encontrado');
                }

                const matchPassword = credentials.password === userFound.password;

                if (!matchPassword) {
                    throw new Error('Contraseña incorrecta');
                }

                return {
                    id: userFound.id.toString(),
                    name: userFound.username,
                    email: userFound.email,
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
};
