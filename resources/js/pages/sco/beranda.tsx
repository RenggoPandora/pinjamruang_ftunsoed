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
import { Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Stats {
    total_pending: number;
    total_approved: number;
    total_rejected: number;
}

interface ReservationRequest {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    status: string;
    deskripsi_acara: string;
    jumlah_orang: number;
    applicant?: {
        name: string;
        email: string;
    };
    ruang?: {
        code: string;
        name: string;
        is_aula: boolean;
        gedung?: {
            name: string;
        };
    };
    organisasi?: {
        name: string;
    };
    created_at: string;
}

interface ScoBerandaProps {
    statistics: Stats;
    pendingRequests: ReservationRequest[];
    newRequestsCount: number;
}

export default function ScoBerandaPage({ statistics, pendingRequests, newRequestsCount }: ScoBerandaProps) {
    const handleViewDetail = (id: number) => {
        router.visit(`/sco/approval/${id}`);
    };

    return (
        <AppLayout>
            <Head title="Beranda SCO" />

            <div className="container mx-auto py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard Sub Coordinator</h1>
                    <p className="text-muted-foreground">
                        Kelola persetujuan peminjaman ruangan
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription>Menunggu Approval</CardDescription>
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <CardTitle className="text-3xl text-yellow-600">
                                {statistics.total_pending}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Pengajuan perlu ditindaklanjuti
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription>Disetujui</CardDescription>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <CardTitle className="text-3xl text-green-600">
                                {statistics.total_approved}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Total pengajuan disetujui
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription>Ditolak</CardDescription>
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <CardTitle className="text-3xl text-red-600">
                                {statistics.total_rejected}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Total pengajuan ditolak
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Requests Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pengajuan Menunggu Approval</CardTitle>
                                <CardDescription>
                                    Daftar peminjaman yang perlu ditindaklanjuti
                                </CardDescription>
                            </div>
                            {pendingRequests.length > 0 && (
                                <Badge variant="warning" className="flex items-center gap-1">
                                    <Bell className="h-3 w-3" />
                                    {pendingRequests.length} Baru
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Tidak ada pengajuan yang menunggu approval
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pemohon</TableHead>
                                        <TableHead>Organisasi</TableHead>
                                        <TableHead className="text-center">Ruangan</TableHead>
                                        <TableHead>Tanggal & Waktu</TableHead>
                                        <TableHead>Peserta</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {request.applicant?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {request.applicant?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{request.organisasi?.name || '-'}</TableCell>
                                            <TableCell className="text-center">
                                                <div>
                                                    <div className="font-medium">
                                                        {request.ruang?.code || '-'}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {request.ruang?.gedung?.name || '-'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div>{format(new Date(request.tanggal), 'dd MMMM yyyy', { locale: id })}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {request.start_time} - {request.end_time}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{request.jumlah_orang}</TableCell>
                                            <TableCell>
                                                {request.ruang?.is_aula ? (
                                                    <Badge variant="info">Aula</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Ruang Kelas</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewDetail(request.id)}
                                                >
                                                    Review
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
