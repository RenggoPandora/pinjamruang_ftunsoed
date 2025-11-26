import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
    Calendar, 
    Clock, 
    Users, 
    Building,
    Download,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReservationRequest {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    status: string;
    deskripsi_acara: string;
    jumlah_orang: number;
    surat_pengajuan: string | null;
    catatan_sco: string | null;
    catatan_wd: string | null;
    approved_at_sco: string | null;
    rejected_at_sco: string | null;
    approved_at_wd: string | null;
    rejected_at_wd: string | null;
    ruang: {
        code: string;
        name: string;
        is_aula: boolean;
        gedung: {
            name: string;
        };
    };
    organisasi: {
        name: string;
        code: string;
    };
    created_at: string;
}

interface DetailProps {
    reservation: ReservationRequest;
}

export default function DetailPage({ reservation }: DetailProps) {
    const getStatusInfo = (status: string) => {
        const statusConfig = {
            pending: { 
                label: 'Menunggu Persetujuan SCO', 
                variant: 'secondary' as const,
                icon: AlertCircle,
                color: 'text-yellow-600'
            },
            approved_sco: { 
                label: 'Disetujui SCO', 
                variant: 'default' as const,
                icon: CheckCircle,
                color: 'text-blue-600'
            },
            rejected_sco: { 
                label: 'Ditolak SCO', 
                variant: 'destructive' as const,
                icon: XCircle,
                color: 'text-red-600'
            },
            pending_wd: { 
                label: 'Menunggu Persetujuan WD2', 
                variant: 'secondary' as const,
                icon: AlertCircle,
                color: 'text-yellow-600'
            },
            approved_wd: { 
                label: 'Disetujui', 
                variant: 'default' as const,
                icon: CheckCircle,
                color: 'text-green-600'
            },
            rejected_wd: { 
                label: 'Ditolak WD2', 
                variant: 'destructive' as const,
                icon: XCircle,
                color: 'text-red-600'
            },
        };

        return statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            variant: 'secondary' as const,
            icon: AlertCircle,
            color: 'text-gray-600'
        };
    };

    const statusInfo = getStatusInfo(reservation.status);
    const StatusIcon = statusInfo.icon;

    return (
        <AppLayout>
            <Head title="Detail Peminjaman" />

            <div className="container mx-auto py-6 max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Detail Peminjaman</h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap pengajuan peminjaman ruangan
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => router.visit('/riwayat')}>
                        Kembali
                    </Button>
                </div>

                {/* Status Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
                            <div>
                                <CardTitle>Status Pengajuan</CardTitle>
                                <CardDescription className="mt-1">
                                    <Badge variant={statusInfo.variant} className="text-sm">
                                        {statusInfo.label}
                                    </Badge>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Diajukan pada: {format(new Date(reservation.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                        </div>
                    </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Ruangan</Label>
                                    <p className="font-medium">{reservation.ruang.code}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {reservation.ruang.name} - {reservation.ruang.gedung.name}
                                    </p>
                                    {reservation.ruang.is_aula && (
                                        <Badge variant="info" className="mt-1">Aula</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Organisasi</Label>
                                    <p className="font-medium">{reservation.organisasi.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {reservation.organisasi.code}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Tanggal</Label>
                                    <p className="font-medium">
                                        {format(new Date(reservation.tanggal), 'dd MMMM yyyy', { locale: id })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Waktu</Label>
                                    <p className="font-medium">
                                        {reservation.start_time} - {reservation.end_time}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Jumlah Peserta</Label>
                                    <p className="font-medium">{reservation.jumlah_orang} orang</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-muted-foreground">Deskripsi Acara</Label>
                            <p className="mt-1">{reservation.deskripsi_acara}</p>
                        </div>

                        {reservation.surat_pengajuan && (
                            <div>
                                <Label className="text-muted-foreground">Surat Pengajuan</Label>
                                <div className="mt-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <a 
                                            href={`/storage/${reservation.surat_pengajuan}`} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Surat
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Approval Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline Persetujuan</CardTitle>
                        <CardDescription>
                            Riwayat proses persetujuan peminjaman
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Pengajuan */}
                        <div className="border-l-2 border-primary pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold">Pengajuan Dibuat</h3>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Berhasil</Badge>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(reservation.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                </p>
                            </div>
                        </div>

                        {/* SCO Approval */}
                        <div className="border-l-2 border-primary pl-4">
                            <div className="flex items-center gap-2 mb-2">
                                {reservation.approved_at_sco ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : reservation.rejected_at_sco ? (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                )}
                                <h3 className="font-semibold">Review Sub Coordinator (SCO)</h3>
                            </div>
                            {reservation.approved_at_sco ? (
                                <div>
                                    <Badge variant="default" className="mb-2">Disetujui</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(reservation.approved_at_sco), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                    {reservation.catatan_sco && (
                                        <div className="mt-2 p-3 bg-muted rounded-md">
                                            <Label className="text-xs text-muted-foreground">Catatan SCO:</Label>
                                            <p className="text-sm mt-1">{reservation.catatan_sco}</p>
                                        </div>
                                    )}
                                </div>
                            ) : reservation.rejected_at_sco ? (
                                <div>
                                    <Badge variant="destructive" className="mb-2">Ditolak</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(reservation.rejected_at_sco), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                    {reservation.catatan_sco && (
                                        <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                                            <Label className="text-xs text-muted-foreground">Alasan Penolakan:</Label>
                                            <p className="text-sm mt-1">{reservation.catatan_sco}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <Badge variant="secondary" className="mb-2">Menunggu Review</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Pengajuan sedang ditinjau oleh Sub Coordinator
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* WD Approval (if applicable) */}
                        {(reservation.ruang.is_aula || reservation.status === 'pending_wd' || reservation.approved_at_wd || reservation.rejected_at_wd) && (
                            <div className="border-l-2 border-primary pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {reservation.approved_at_wd ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : reservation.rejected_at_wd ? (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    )}
                                    <h3 className="font-semibold">Review Wakil Dekan 2 (WD2)</h3>
                                </div>
                                {reservation.approved_at_wd ? (
                                    <div>
                                        <Badge variant="default" className="mb-2">Disetujui</Badge>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(reservation.approved_at_wd), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                        </p>
                                        {reservation.catatan_wd && (
                                            <div className="mt-2 p-3 bg-muted rounded-md">
                                                <Label className="text-xs text-muted-foreground">Catatan WD2:</Label>
                                                <p className="text-sm mt-1">{reservation.catatan_wd}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : reservation.rejected_at_wd ? (
                                    <div>
                                        <Badge variant="destructive" className="mb-2">Ditolak</Badge>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(reservation.rejected_at_wd), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                        </p>
                                        {reservation.catatan_wd && (
                                            <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                                                <Label className="text-xs text-muted-foreground">Alasan Penolakan:</Label>
                                                <p className="text-sm mt-1">{reservation.catatan_wd}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : reservation.status === 'pending_wd' ? (
                                    <div>
                                        <Badge variant="secondary" className="mb-2">Menunggu Review</Badge>
                                        <p className="text-sm text-muted-foreground">
                                            Pengajuan sedang ditinjau oleh Wakil Dekan 2
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <Badge variant="secondary" className="mb-2">Belum Diproses</Badge>
                                        <p className="text-sm text-muted-foreground">
                                            Menunggu persetujuan dari Sub Coordinator terlebih dahulu
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Final Status */}
                        {(reservation.status === 'approved_wd' || reservation.status === 'approved_sco') && (
                            <div className="border-l-2 border-green-600 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <h3 className="font-semibold text-green-600">Pengajuan Disetujui</h3>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Peminjaman ruangan telah disetujui. Silakan persiapkan acara Anda.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(reservation.status === 'rejected_sco' || reservation.status === 'rejected_wd') && (
                            <div className="border-l-2 border-red-600 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                    <h3 className="font-semibold text-red-600">Pengajuan Ditolak</h3>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Mohon periksa alasan penolakan di atas. Anda dapat mengajukan peminjaman baru.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
