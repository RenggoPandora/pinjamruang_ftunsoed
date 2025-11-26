import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building2, Calendar, Clock, Users, FileText, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

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
    applicant: {
        name: string;
        email: string;
    };
    ruang: {
        code: string;
        name: string;
        gedung: {
            name: string;
        };
    };
    organisasi: {
        name: string;
        code?: string;
    };
    created_at: string;
}

interface Props {
    reservation: ReservationRequest;
}

export default function WDApproval({ reservation }: Props) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!action) {
            toast({
                variant: 'destructive',
                title: 'Peringatan',
                description: 'Silakan pilih tindakan terlebih dahulu',
            });
            return;
        }

        if (action === 'reject' && !notes.trim()) {
            toast({
                variant: 'destructive',
                title: 'Peringatan',
                description: 'Mohon berikan catatan/alasan penolakan',
            });
            return;
        }

        setIsSubmitting(true);

        router.post(`/wd/approval/${reservation.id}`, {
            action,
            catatan_wd: notes,
        }, {
            onSuccess: () => {
                toast({
                    variant: action === 'approve' ? 'success' : 'destructive',
                    title: action === 'approve' ? 'Pengajuan Disetujui' : 'Pengajuan Ditolak',
                    description: `Permintaan peminjaman ruangan telah ${action === 'approve' ? 'disetujui' : 'ditolak'}`,
                });
                
                setTimeout(() => {
                    router.visit('/wd/beranda');
                }, 1500);
            },
            onError: () => {
                toast({
                    variant: 'destructive',
                    title: 'Terjadi Kesalahan',
                    description: 'Gagal memproses pengajuan, silakan coba lagi',
                });
                setIsSubmitting(false);
            },
        });
    };

    const handleDownload = () => {
        if (reservation.surat_pengajuan) {
            window.open(`/storage/${reservation.surat_pengajuan}`, '_blank');
        }
    };

    return (
        <AppLayout>
            <Head title="Review Permintaan Peminjaman Aula" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Review Permintaan Peminjaman</h1>
                    <p className="text-muted-foreground">
                        Tinjau detail permintaan dan berikan keputusan persetujuan
                    </p>
                </div>

                {/* Alert Info */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-blue-900">
                                    Permintaan ini telah disetujui oleh Sub Coordinator
                                </p>
                                <p className="text-sm text-blue-700">
                                    Sebagai WD2, Anda memberikan persetujuan final untuk peminjaman Aula FT UNSOED.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Applicant Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informasi Pemohon
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
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
                                <p className="font-medium">{reservation.organisasi.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Tanggal Pengajuan</Label>
                                <p className="font-medium">
                                    {format(new Date(reservation.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Detail Peminjaman
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Gedung & Ruang</Label>
                                    <p className="font-medium">{reservation.ruang.gedung.name} - {reservation.ruang.code}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Tanggal Peminjaman</Label>
                                    <p className="font-medium">
                                        {format(new Date(reservation.tanggal), 'dd MMMM yyyy', { locale: id })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-muted-foreground">Waktu</Label>
                                    <p className="font-medium">{reservation.start_time} - {reservation.end_time}</p>
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
                            <Label className="text-muted-foreground">Tujuan Peminjaman</Label>
                            <p className="mt-1">{reservation.deskripsi_acara}</p>
                        </div>

                        {reservation.surat_pengajuan && (
                            <div>
                                <Label className="text-muted-foreground">Surat Pengajuan</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Surat Pengajuan
                                </Button>
                            </div>
                        )}

                        {reservation.catatan_sco && (
                            <div>
                                <Label className="text-muted-foreground">Catatan dari Sub Coordinator</Label>
                                <div className="mt-1 p-3 bg-muted rounded-md">
                                    <p className="text-sm">{reservation.catatan_sco}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Approval Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tindakan</CardTitle>
                        <CardDescription>
                            Pilih tindakan yang akan diambil untuk permintaan ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label>Pilih Tindakan</Label>
                                <RadioGroup value={action || ''} onValueChange={(value) => setAction(value as 'approve' | 'reject')}>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                                        <RadioGroupItem value="approve" id="approve" />
                                        <Label htmlFor="approve" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium">Setujui Peminjaman</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Berikan persetujuan final untuk peminjaman Aula
                                                    </p>
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                                        <RadioGroupItem value="reject" id="reject" />
                                        <Label htmlFor="reject" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-600" />
                                                <div>
                                                    <p className="font-medium">Tolak Peminjaman</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tolak permintaan ini dengan alasan yang jelas
                                                    </p>
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {action && (
                                <div className="space-y-2">
                                    <Label htmlFor="notes">
                                        {action === 'approve' ? 'Catatan (Opsional)' : 'Alasan Penolakan *'}
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={
                                            action === 'approve'
                                                ? 'Tambahkan catatan jika diperlukan...'
                                                : 'Jelaskan alasan penolakan dengan jelas...'
                                        }
                                        rows={4}
                                        required={action === 'reject'}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={!action || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Submit'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/wd/beranda')}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
