import { Head, router } from '@inertiajs/react';
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
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReservationRequest {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    status: string;
    deskripsi_acara: string;
    user?: {
        name: string;
        email: string;
    };
    ruang?: {
        code: string;
        name: string;
        gedung?: {
            name: string;
        };
    };
    organisasi?: {
        name: string;
    };
}

interface BerandaProps {
    reservations: ReservationRequest[];
}

export default function Beranda({ reservations = [] }: BerandaProps) {

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu Persetujuan SCO', variant: 'warning' as const },
            approved_sco: { label: 'Disetujui', variant: 'success' as const },
            rejected_sco: { label: 'Ditolak SCO', variant: 'destructive' as const },
            pending_wd: { label: 'Menunggu Persetujuan WD2', variant: 'warning' as const },
            approved_wd: { label: 'Disetujui', variant: 'success' as const },
            rejected_wd: { label: 'Ditolak WD2', variant: 'destructive' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            variant: 'secondary' as const,
        };

        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Beranda" />

            <div className="container mx-auto py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Beranda</h1>
                    <p className="text-muted-foreground">
                        Kelola dan pantau peminjaman ruangan Anda
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Peminjaman Ruangan</CardTitle>
                        <CardDescription>
                            Semua peminjaman ruangan yang telah diajukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {reservations.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Belum ada data peminjaman
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pemohon</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead>Organisasi</TableHead>
                                        <TableHead>Acara</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reservations.map((reservation) => (
                                                <TableRow key={reservation.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {reservation.user?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {reservation.user?.email || '-'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {format(
                                                            new Date(reservation.tanggal),
                                                            'dd MMM yyyy',
                                                            { locale: id }
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {reservation.start_time} -{' '}
                                                        {reservation.end_time}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {reservation.ruang?.code || '-'}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {reservation.ruang?.gedung?.name || '-'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {reservation.organisasi?.name || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-xs truncate">
                                                            {reservation.deskripsi_acara}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(reservation.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.visit(`/detail/${reservation.id}`)}
                                                        >
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
