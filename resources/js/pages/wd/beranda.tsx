import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, XCircle, Bell, AlertTriangle } from 'lucide-react';
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
    has_conflict?: boolean;
    conflict_count?: number;
    applicant?: {
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
    created_at: string;
}

interface Statistics {
    total_pending: number;
    total_approved: number;
    total_rejected: number;
}

interface Props {
    statistics: Statistics;
    pendingRequests: ReservationRequest[];
    newRequestsCount: number;
}

export default function WDBeranda({ statistics, pendingRequests, newRequestsCount }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard WD2" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard WD2</h1>
                        <p className="text-muted-foreground">
                            Kelola persetujuan peminjaman Aula FT UNSOED
                        </p>
                    </div>
                    {newRequestsCount > 0 && (
                        <div className="flex items-center gap-2 text-primary">
                            <Bell className="h-5 w-5" />
                            <span className="font-semibold">{newRequestsCount} Permintaan Baru</span>
                        </div>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Menunggu Persetujuan
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Permintaan peminjaman Aula
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Disetujui
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_approved}</div>
                            <p className="text-xs text-muted-foreground">
                                Total peminjaman Aula disetujui
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ditolak
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_rejected}</div>
                            <p className="text-xs text-muted-foreground">
                                Total peminjaman Aula ditolak
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Requests Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Permintaan Menunggu Persetujuan
                        </CardTitle>
                        <CardDescription>
                            Daftar peminjaman Aula yang diteruskan oleh Sub Coordinator
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Tidak ada permintaan yang menunggu persetujuan</p>
                            </div>
                        ) : (
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal Pengajuan</TableHead>
                                            <TableHead>Pemohon</TableHead>
                                            <TableHead>Organisasi</TableHead>
                                            <TableHead className="text-center">Ruang</TableHead>
                                            <TableHead>Tanggal Peminjaman</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.map((request) => (
                                            <TableRow 
                                                key={request.id}
                                                className={request.has_conflict ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''}
                                            >
                                                <TableCell>
                                                    {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: id })}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{request.applicant?.name || 'N/A'}</div>
                                                        <div className="text-sm text-muted-foreground">{request.applicant?.email || 'N/A'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{request.organisasi?.name || '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <div>
                                                        <div className="font-medium flex items-center justify-center gap-1">
                                                            {request.has_conflict && (
                                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                            )}
                                                            {request.ruang?.code || '-'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{request.ruang?.gedung?.name || '-'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div>{format(new Date(request.tanggal), 'dd MMMM yyyy', { locale: id })}</div>
                                                        {request.has_conflict && (
                                                            <Badge variant="destructive" className="mt-1 text-xs">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Konflik: {request.conflict_count} pengajuan
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {request.start_time} - {request.end_time}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="warning">Menunggu WD2</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/wd/approval/${request.id}`}>
                                                        <Button 
                                                            size="sm"
                                                            variant={request.has_conflict ? 'destructive' : 'default'}
                                                        >
                                                            Review
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
