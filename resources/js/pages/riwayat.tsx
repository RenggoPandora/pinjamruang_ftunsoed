import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    ruang: {
        code: string;
        name: string;
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

interface RiwayatProps {
    reservations: ReservationRequest[];
    statistics: {
        total: number;
        approved: number;
        rejected: number;
        pending: number;
    };
}

export default function Riwayat({ reservations, statistics }: RiwayatProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu SCO', variant: 'secondary' as const },
            approved_sco: { label: 'Disetujui SCO', variant: 'default' as const },
            rejected_sco: { label: 'Ditolak SCO', variant: 'destructive' as const },
            pending_wd: { label: 'Menunggu WD', variant: 'secondary' as const },
            approved_wd: { label: 'Disetujui', variant: 'default' as const },
            rejected_wd: { label: 'Ditolak', variant: 'destructive' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            variant: 'secondary' as const,
        };

        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Riwayat Peminjaman" />

            <div className="container mx-auto py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Riwayat Peminjaman</h1>
                    <p className="text-muted-foreground">
                        Lihat seluruh riwayat peminjaman ruangan yang telah Anda ajukan
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Peminjaman</CardDescription>
                            <CardTitle className="text-3xl">{statistics.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Disetujui</CardDescription>
                            <CardTitle className="text-3xl text-green-600">
                                {statistics.approved}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Ditolak</CardDescription>
                            <CardTitle className="text-3xl text-red-600">
                                {statistics.rejected}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Menunggu</CardDescription>
                            <CardTitle className="text-3xl text-yellow-600">
                                {statistics.pending}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* History Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Riwayat</CardTitle>
                        <CardDescription>
                            Detail lengkap semua peminjaman yang pernah diajukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reservations.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Belum ada riwayat peminjaman
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal Pengajuan</TableHead>
                                        <TableHead>Tanggal Peminjaman</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Organisasi</TableHead>
                                        <TableHead>Peserta</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.map((reservation) => (
                                        <TableRow key={reservation.id}>
                                            <TableCell className="font-medium">
                                                {format(
                                                    new Date(reservation.created_at),
                                                    'dd MMM yyyy HH:mm',
                                                    { locale: id }
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(reservation.tanggal),
                                                    'dd MMM yyyy',
                                                    { locale: id }
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.start_time} - {reservation.end_time}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {reservation.ruang.code}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {reservation.ruang.gedung.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {reservation.organisasi.code}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {reservation.organisasi.name}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{reservation.jumlah_orang}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(reservation.status)}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
