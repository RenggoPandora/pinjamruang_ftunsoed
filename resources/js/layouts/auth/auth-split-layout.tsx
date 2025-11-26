import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Building2, Users, Shield } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-[oklch(0.3_0.08_255)] via-[oklch(0.25_0.08_255)] to-[oklch(0.2_0.08_255)] p-10 text-white lg:flex">
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3"
                >
                    <AppLogoIcon className="size-10" />
                    <div>
                        <p className="text-xl font-bold">Pinjam Ruang</p>
                        <p className="text-xs text-white/80">Fakultas Teknik UNSOED</p>
                    </div>
                </Link>
                
                <div className="relative z-20 mt-auto space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold leading-tight">
                            Sistem Peminjaman Ruangan Digital
                        </h2>
                        <p className="text-lg text-white/80">
                            Kelola peminjaman ruangan dengan mudah, cepat, dan efisien
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">50+ Ruangan Tersedia</p>
                                <p className="text-sm text-white/70">Di seluruh gedung Fakultas Teknik</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Mudah & Terintegrasi</p>
                                <p className="text-sm text-white/70">Untuk semua organisasi mahasiswa</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold">Aman & Terpercaya</p>
                                <p className="text-sm text-white/70">Dengan sistem persetujuan bertingkat</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-3 lg:hidden"
                    >
                        <AppLogoIcon className="h-12 w-12" />
                        <div className="text-left">
                            <p className="text-lg font-bold text-[oklch(0.3_0.08_255)]">Pinjam Ruang</p>
                            <p className="text-xs text-muted-foreground">Fakultas Teknik UNSOED</p>
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                    <p className="px-8 text-center text-xs text-muted-foreground">
                        Dengan masuk, Anda menyetujui{' '}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Syarat & Ketentuan
                        </a>{' '}
                        dan{' '}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Kebijakan Privasi
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
