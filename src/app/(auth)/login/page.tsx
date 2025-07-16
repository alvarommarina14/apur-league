'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

type LoginFormData = {
    email: string;
    password: string;
};

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const router = useRouter();

    const onSubmit = async (data: { email: string; password: string }) => {
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            toast.error('Contraseña incorrecta', {
                position: 'top-center',
                duration: 3000,
                style: {
                    background: '#FEE2E2',
                    color: '#A00000',
                    border: '1px solid #EF4444',
                    fontWeight: '600',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                },
                iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                },
            });
        } else {
            router.push('/admin');
        }
    };

    return (
        <main className="flex flex-col md:flex-row min-h-screen">
            <div className="hidden md:block md:w-8/12 h-screen">
                <Image
                    src="/home-image.jpg"
                    alt="Fondo de cancha de tenis"
                    width={2000}
                    height={2000}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full md:w-4/12 flex flex-col items-center justify-center p-6 md:px-12 bg-neutral-50">
                <div className="w-full max-w-sm flex flex-col">
                    <Link className="cursor-pointer" href="/">
                        <Image
                            src="/logo-apur.png"
                            alt="Logo de la liga"
                            width={300}
                            height={300}
                            className="w-56 sm:w-72 md:w-full h-auto self-center mb-6"
                        />
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-left text-apur-green">
                        Login
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col w-full"
                    >
                        <div className="flex flex-col gap-2 w-full mb-4">
                            <input
                                id="email-input"
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                                type="email"
                                className="border-2 border-neutral-600 rounded-lg p-3 focus:border-apur-green focus:ring-2 focus:ring-apur-green focus:outline-none transition-colors" // Added focus styles
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full mb-6">
                            <input
                                id="password-input"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password must have at least 8 characters',
                                    },
                                })}
                                type="password"
                                className="border-2 border-neutral-600 rounded-lg p-3 focus:border-apur-green focus:ring-2 focus:ring-apur-green focus:outline-none transition-colors"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-apur-green hover:bg-apur-green-hover font-semibold cursor-pointer w-full p-3 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Ingresar
                        </button>
                    </form>
                    <Toaster />
                </div>
            </div>
        </main>
    );
}
