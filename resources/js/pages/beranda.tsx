import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

interface ReservationRequest {
    id: number;
    tanggal: string;
    start_time: string;
    end_time: string;
    status: string;
    deskripsi_acara: string;
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
    approvedDates: string[];
}

export default function Beranda({ reservations = [], approvedDates = [] }: BerandaProps) {
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

                <Tabs defaultValue="table" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        <TabsTrigger value="table">Tabel Peminjaman</TabsTrigger>
                        <TabsTrigger value="calendar">Kalender</TabsTrigger>
                    </TabsList>

                    <TabsContent value="table" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Peminjaman Ruangan</CardTitle>
                                <CardDescription>
                                    Semua peminjaman ruangan yang telah Anda ajukan
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
                                                            Lihat
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kalender Peminjaman</CardTitle>
                                <CardDescription>
                                    Peminjaman yang telah disetujui ditampilkan dalam kalender
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="fullcalendar-wrapper">
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek'
                                        }}
                                        buttonText={{
                                            today: 'Hari Ini',
                                            month: 'Bulan',
                                            week: 'Minggu'
                                        }}
                                        locale="id"
                                        events={reservations
                                            .filter(r => (r.status === 'approved_sco' || r.status === 'approved_wd') && r.organisasi && r.ruang)
                                            .map(r => ({
                                                id: r.id.toString(),
                                                title: (r.organisasi?.name || 'N/A') + ' - ' + (r.ruang?.code || 'N/A'),
                                                start: r.tanggal + ' ' + r.start_time,
                                                end: r.tanggal + ' ' + r.end_time,
                                                backgroundColor: 'oklch(0.3 0.08 255)',
                                                borderColor: 'oklch(0.3 0.08 255)',
                                            }))}
                                        eventClick={(info) => {
                                            const reservation = reservations.find(r => r.id.toString() === info.event.id);
                                            if (reservation && reservation.organisasi && reservation.ruang) {
                                                alert(`
═══════════════════════════════════
DETAIL PEMINJAMAN RUANG
═══════════════════════════════════

📋 Organisasi: ${reservation.organisasi?.name || 'N/A'}
🏢 Lokasi: ${reservation.ruang?.gedung?.name || 'N/A'} - ${reservation.ruang?.code || 'N/A'}
📅 Tanggal: ${format(new Date(reservation.tanggal), 'dd MMMM yyyy', { locale: id })}
⏰ Waktu: ${reservation.start_time} - ${reservation.end_time}
📝 Acara: ${reservation.deskripsi_acara}
✅ Status: ${getStatusBadge(reservation.status).props.children}

═══════════════════════════════════
                                                `.trim());
                                            }
                                        }}
                                        height="auto"
                                        eventTimeFormat={{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }}
                                        dayMaxEvents={3}
                                        eventDisplay="block"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <style>{`
                .fullcalendar-wrapper .fc {
                    font-family: inherit;
                }
                .fullcalendar-wrapper .fc-button {
                    background-color: oklch(0.3 0.08 255);
                    border-color: oklch(0.3 0.08 255);
                    text-transform: capitalize;
                }
                .fullcalendar-wrapper .fc-button:hover {
                    background-color: oklch(0.25 0.08 255);
                    border-color: oklch(0.25 0.08 255);
                }
                .fullcalendar-wrapper .fc-button:disabled {
                    opacity: 0.5;
                }
                .fullcalendar-wrapper .fc-button-active {
                    background-color: oklch(0.25 0.08 255) !important;
                    border-color: oklch(0.25 0.08 255) !important;
                }
                .fullcalendar-wrapper .fc-daygrid-event {
                    cursor: pointer;
                }
                .fullcalendar-wrapper .fc-event-title {
                    font-weight: 500;
                }
                .fullcalendar-wrapper .fc-col-header-cell {
                    background-color: oklch(0.97 0 0);
                    font-weight: 600;
                }
            `}</style>
        </AppLayout>
    );
}
