import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    CheckCircle, 
    XCircle, 
    Send, 
    FileText, 
    Calendar, 
    Clock, 
    Users, 
    Building,
    Download 
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

interface ReservationRequest {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    status: string;
    deskripsi_acara: string;
    jumlah_orang: number;
    surat_pengajuan: string;
    applicant: {
        name: string;
        email: string;
    };
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

interface ApprovalProps {
    reservation: ReservationRequest;
}

export default function ScoApprovalPage({ reservation }: ApprovalProps) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    
    const { data, setData, post, processing } = useForm({
        action: '',
        catatan_sco: '',
    });

    const handleApprove = () => {
        setAction('approve');
        // If Aula, forward to WD, otherwise approve directly
        const actionType = reservation.ruang.is_aula ? 'forward' : 'approve';
        setData('action', actionType);
    };

    const handleReject = () => {
        setAction('reject');
        setData('action', 'reject');
    };

    const handleSubmit = () => {
        post(`/sco/approval/${reservation.id}`, {
            onSuccess: () => {
                router.visit('/sco/beranda');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Review Pengajuan" />

            <div className="container mx-auto py-6 max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Review Pengajuan</h1>
                        <p className="text-muted-foreground">
                            Detail pengajuan peminjaman ruangan
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => router.visit('/sco/beranda')}>
                        Kembali
                    </Button>
                </div>

                {/* Applicant Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pemohon</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="text-muted-foreground">Nama</Label>
                            <p className="font-medium">{reservation.applicant.name}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{reservation.applicant.email}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Organisasi</Label>
                            <p className="font-medium">
                                {reservation.organisasi.name} ({reservation.organisasi.code})
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                    </CardContent>
                </Card>

                {/* Action Section */}
                {!action ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tindakan</CardTitle>
                            <CardDescription>
                                Pilih tindakan untuk pengajuan ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button 
                                onClick={handleApprove}
                                className="flex-1"
                                variant="default"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {reservation.ruang.is_aula ? 'Forward ke WD' : 'Setujui'}
                            </Button>
                            <Button 
                                onClick={handleReject}
                                className="flex-1"
                                variant="destructive"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Tolak
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {action === 'approve' 
                                    ? (reservation.ruang.is_aula ? 'Forward ke WD' : 'Setujui Pengajuan')
                                    : 'Tolak Pengajuan'}
                            </CardTitle>
                            <CardDescription>
                                {action === 'approve'
                                    ? 'Berikan catatan persetujuan (opsional)'
                                    : 'Berikan alasan penolakan'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="catatan">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    placeholder={action === 'approve' 
                                        ? "Tambahkan catatan jika diperlukan..."
                                        : "Jelaskan alasan penolakan..."}
                                    rows={4}
                                    value={data.catatan_sco}
                                    onChange={(e) => setData('catatan_sco', e.target.value)}
                                    required={action === 'reject'}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing || (action === 'reject' && !data.catatan_sco)}
                                    className="flex-1"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {processing ? 'Memproses...' : 'Kirim'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAction(null);
                                        setData('catatan_sco', '');
                                    }}
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
