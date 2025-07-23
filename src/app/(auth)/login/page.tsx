'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { showErrorToast } from '@/components/Toast';

import Image from 'next/image';
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

    const onSubmit = async (data: LoginFormData) => {
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (!res?.ok) {
            showErrorToast(String(res?.error));
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            <div className="hidden md:block md:w-8/12 h-screen">
                <Image
                    src="/home-image.jpg"
                    alt="Fondo de cancha de tenis"
                    width={2000}
                    height={2000}
                    priority
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="w-full md:w-4/12 min-h-screen flex flex-col justify-center px-8 py-12 bg-neutral-50">
                <div className="w-full max-w-sm mx-auto">
                    <Link href="/" className="block text-center mb-8">
                        <Image
                            src="/logo-apur.png"
                            alt="Logo de la liga"
                            width={300}
                            height={300}
                            className="w-56 mx-auto"
                        />
                    </Link>

                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-apur-green">Iniciar sesión</h1>
                    <p className="text-sm text-neutral-500 text-center mb-6">Ingresá tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                {...register('email', { required: 'Email es requerido' })}
                                placeholder="Email"
                                className={`w-full text-gray-900 px-4 py-3 rounded-md border ${
                                    errors.email
                                        ? 'border-red-700 bg-red-50 focus:ring-red-700 focus:border-red-700'
                                        : 'border-gray-300 bg-white focus:ring-apur-green focus:border-apur-green'
                                } focus:outline-none focus:ring-1`}
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Contraseña es requerida',
                                    minLength: {
                                        value: 8,
                                        message: 'Debe tener al menos 8 caracteres',
                                    },
                                })}
                                placeholder="Contraseña"
                                className={`w-full text-gray-900 px-4 py-3 rounded-md border ${
                                    errors.password
                                        ? 'border-red-700 bg-red-50 focus:ring-red-700 focus:border-red-700'
                                        : 'border-gray-300 bg-white focus:ring-apur-green focus:border-apur-green'
                                } focus:outline-none focus:ring-1`}
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-apur-green hover:bg-apur-green-hover text-white font-medium py-3 rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
