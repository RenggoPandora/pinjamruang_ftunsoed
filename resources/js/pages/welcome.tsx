import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Calendar, Clock, Users, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Calendar,
            title: 'Pemesanan Mudah',
            description: 'Pesan ruangan dengan cepat dan mudah melalui sistem online yang terintegrasi.'
        },
        {
            icon: Clock,
            title: 'Real-Time Availability',
            description: 'Lihat ketersediaan ruangan secara real-time dan hindari bentrok jadwal.'
        },
        {
            icon: Shield,
            title: 'Sistem Persetujuan',
            description: 'Proses persetujuan bertingkat untuk memastikan penggunaan ruangan yang teratur.'
        },
        {
            icon: Building2,
            title: 'Beragam Ruangan',
            description: 'Akses ke berbagai ruangan di seluruh gedung Fakultas Teknik UNSOED.'
        },
        {
            icon: Users,
            title: 'Multi-Organisasi',
            description: 'Kelola peminjaman untuk berbagai organisasi mahasiswa dengan mudah.'
        },
        {
            icon: Zap,
            title: 'Notifikasi Instant',
            description: 'Dapatkan notifikasi langsung tentang status peminjaman Anda.'
        },
    ];

    return (
        <>
            <Head title="Welcome" />
            
            {/* Hero Section */}
            <div className="min-h-screen bg-gradient-to-br from-[oklch(0.3_0.08_255)] via-[oklch(0.25_0.08_255)] to-[oklch(0.2_0.08_255)]">
                {/* Navigation */}
                <nav className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/assets/images/LogoUnsoed.webp" 
                                alt="Logo UNSOED" 
                                className="h-12 w-12"
                            />
                            <div className="text-white">
                                <h1 className="text-xl font-bold">PinjamRuang</h1>
                                <p className="text-xs text-white/80">Fakultas Teknik UNSOED</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Button 
                                    asChild
                                    variant="secondary"
                                    size="lg"
                                >
                                    <Link href={dashboard()}>
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        asChild
                                        variant="ghost"
                                        size="lg"
                                        className="text-white hover:bg-white/10 hover:text-white"
                                    >
                                        <Link href={login()}>
                                            Masuk
                                        </Link>
                                    </Button>
                                    {canRegister && (
                                        <Button 
                                            asChild
                                            variant="secondary"
                                            size="lg"
                                        >
                                            <Link href={register()}>
                                                Daftar
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="container mx-auto px-6 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-8">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Sistem Peminjaman Ruangan Online</span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                Kelola Peminjaman Ruangan dengan <span className="text-yellow-300">Lebih Mudah</span>
                            </h1>
                            
                            <p className="text-xl text-white/80 leading-relaxed">
                                Platform digital untuk memudahkan mahasiswa dan organisasi dalam melakukan peminjaman ruangan di Fakultas Teknik UNSOED.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                {auth.user ? (
                                    <Button 
                                        asChild
                                        size="lg"
                                        className="bg-white text-[oklch(0.3_0.08_255)] hover:bg-white/90"
                                    >
                                        <Link href={dashboard()}>
                                            Buka Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            asChild
                                            size="lg"
                                            className="bg-white text-[oklch(0.3_0.08_255)] hover:bg-white/90"
                                        >
                                            <Link href={register()}>
                                                Mulai Sekarang
                                            </Link>
                                        </Button>
                                        <Button 
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="border-white text-white hover:bg-white/10"
                                        >
                                            <Link href={login()}>
                                                Sudah Punya Akun?
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-8 pt-8">
                                <div>
                                    <p className="text-3xl font-bold">500+</p>
                                    <p className="text-white/70 text-sm">Peminjaman Sukses</p>
                                </div>
                                <div className="h-12 w-px bg-white/20"></div>
                                <div>
                                    <p className="text-3xl font-bold">50+</p>
                                    <p className="text-white/70 text-sm">Ruangan Tersedia</p>
                                </div>
                                <div className="h-12 w-px bg-white/20"></div>
                                <div>
                                    <p className="text-3xl font-bold">100%</p>
                                    <p className="text-white/70 text-sm">Digital & Terintegrasi</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/20 to-transparent rounded-3xl blur-3xl"></div>
                                <img 
                                    src="/assets/images/LogoUnsoed.webp" 
                                    alt="Hero Image" 
                                    className="relative w-full max-w-lg mx-auto drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20 lg:py-32">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Fitur Unggulan
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Nikmati berbagai kemudahan dalam mengelola peminjaman ruangan dengan fitur-fitur canggih kami
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-2 hover:border-[oklch(0.3_0.08_255)] transition-all hover:shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="h-12 w-12 rounded-lg bg-[oklch(0.3_0.08_255)]/10 flex items-center justify-center">
                                        <feature.icon className="h-6 w-6 text-[oklch(0.3_0.08_255)]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[oklch(0.3_0.08_255)] to-[oklch(0.25_0.08_255)] py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Siap untuk Memulai?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Bergabunglah dengan ratusan mahasiswa dan organisasi yang telah mempercayai sistem kami
                    </p>
                    {!auth.user && (
                        <Button 
                            asChild
                            size="lg"
                            className="bg-white text-[oklch(0.3_0.08_255)] hover:bg-white/90"
                        >
                            <Link href={register()}>
                                Daftar Sekarang - Gratis!
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/assets/images/LogoUnsoed.webp" 
                                alt="Logo UNSOED" 
                                className="h-10 w-10"
                            />
                            <div>
                                <p className="font-semibold">PinjamRuang FT UNSOED</p>
                                <p className="text-sm text-gray-400">Fakultas Teknik - Universitas Jenderal Soedirman</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} PinjamRuang FT UNSOED. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
