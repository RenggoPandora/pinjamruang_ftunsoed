import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Filter, User, Building, Clock, Users, FileText, Download } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReservationEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: {
        organization: string;
        gedung: string;
        ruang: string;
        user: string;
        user_email: string;
        jumlah_peserta: number;
        tujuan_peminjaman: string;
        status: string;
        surat_pengajuan: string | null;
    };
}

interface Gedung {
    id: number;
    name: string;
}

interface Ruang {
    id: number;
    code: string;
    gedung_id: number;
}

interface Props {
    events: ReservationEvent[];
    gedungs: Gedung[];
    ruangs: Ruang[];
}

export default function Kalender({ events, gedungs, ruangs }: Props) {
    const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null);
    const [selectedGedung, setSelectedGedung] = useState<string>('all');
    const [selectedRuang, setSelectedRuang] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ReservationEvent | null>(null);

    // Debug: Log events data
    console.log('Events from backend:', events);
    console.log('Total events:', events.length);

    // Generate months for filter (current month + next 6 months)
    const months = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        return {
            value: format(date, 'yyyy-MM'),
            label: format(date, 'MMMM yyyy', { locale: id }),
        };
    });

    // Filter ruangs based on selected gedung
    const filteredRuangs = selectedGedung === 'all'
        ? ruangs
        : ruangs.filter(ruang => ruang.gedung_id === parseInt(selectedGedung));

    // Apply filters with useMemo
    const filteredEvents = useMemo(() => {
        let filtered = [...events];

        console.log('Before filtering:', filtered.length);

        // Filter by gedung
        if (selectedGedung !== 'all') {
            filtered = filtered.filter(event => {
                const ruang = ruangs.find(r => r.code === event.extendedProps.ruang);
                return ruang?.gedung_id === parseInt(selectedGedung);
            });
        }

        // Filter by ruang
        if (selectedRuang !== 'all') {
            filtered = filtered.filter(event => event.extendedProps.ruang === selectedRuang);
        }

        // Filter by month
        if (selectedMonth !== 'all') {
            filtered = filtered.filter(event => {
                const eventMonth = format(new Date(event.start), 'yyyy-MM');
                return eventMonth === selectedMonth;
            });
        }

        console.log('After filtering:', filtered.length);
        console.log('Filtered events sample:', filtered.slice(0, 2));

        return filtered;
    }, [selectedGedung, selectedRuang, selectedMonth, events, ruangs]);

    // Navigate calendar to selected month
    useEffect(() => {
        if (selectedMonth !== 'all' && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(selectedMonth + '-01');
        }
    }, [selectedMonth]);

    // Handle filter changes
    const handleGedungChange = (value: string) => {
        setSelectedGedung(value);
        setSelectedRuang('all'); // Reset ruang when gedung changes
    };

    const handleRuangChange = (value: string) => {
        setSelectedRuang(value);
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
    };

    // Event click handler
    const handleEventClick = (info: { event: { id: string; title: string; start: Date | null; end: Date | null; extendedProps: Record<string, unknown> } }) => {
        const event = info.event;
        const props = event.extendedProps;
        
        setSelectedEvent({
            id: event.id,
            title: event.title,
            start: event.start?.toISOString() || '',
            end: event.end?.toISOString() || '',
            backgroundColor: '',
            borderColor: '',
            extendedProps: {
                organization: props.organization as string,
                gedung: props.gedung as string,
                ruang: props.ruang as string,
                user: props.user as string,
                user_email: props.user_email as string,
                jumlah_peserta: props.jumlah_peserta as number,
                tujuan_peminjaman: props.tujuan_peminjaman as string,
                status: props.status as string,
                surat_pengajuan: props.surat_pengajuan as string | null,
            }
        });
        setIsDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Kalender Peminjaman" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kalender Peminjaman</h1>
                    <p className="text-muted-foreground">
                        Lihat jadwal peminjaman ruang yang telah disetujui
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Kalender
                        </CardTitle>
                        <CardDescription>
                            Filter berdasarkan gedung, ruang, atau bulan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gedung">Gedung</Label>
                                <Select value={selectedGedung} onValueChange={handleGedungChange}>
                                    <SelectTrigger id="gedung">
                                        <SelectValue placeholder="Pilih Gedung" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Gedung</SelectItem>
                                        {gedungs.map((gedung) => (
                                            <SelectItem key={gedung.id} value={gedung.id.toString()}>
                                                {gedung.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ruang">Ruang</Label>
                                <Select value={selectedRuang} onValueChange={handleRuangChange} disabled={selectedGedung === 'all'}>
                                    <SelectTrigger id="ruang">
                                        <SelectValue placeholder="Pilih Ruang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ruang</SelectItem>
                                        {filteredRuangs.map((ruang) => (
                                            <SelectItem key={ruang.id} value={ruang.code}>
                                                {ruang.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="month">Bulan</Label>
                                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                    <SelectTrigger id="month">
                                        <SelectValue placeholder="Pilih Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Bulan</SelectItem>
                                        {months.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {(selectedGedung !== 'all' || selectedRuang !== 'all' || selectedMonth !== 'all') && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                    Menampilkan {filteredEvents.length} dari {events.length} peminjaman
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Calendar */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="fullcalendar-wrapper">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,listMonth'
                                }}
                                buttonText={{
                                    today: 'Hari Ini',
                                    month: 'Bulan',
                                    week: 'Minggu',
                                    list: 'Daftar'
                                }}
                                locale="id"
                                events={filteredEvents}
                                eventClick={handleEventClick}
                                height="auto"
                                eventTimeFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }}
                                slotLabelFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }}
                                dayMaxEvents={3}
                                eventDisplay="block"
                                displayEventTime={true}
                                displayEventEnd={false}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Keterangan Warna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'oklch(0.3 0.08 255)' }}></div>
                                <span className="text-sm">Peminjaman Disetujui</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Event Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Detail Peminjaman Ruangan
                        </DialogTitle>
                        <DialogDescription>
                            Informasi lengkap peminjaman yang telah disetujui
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedEvent && (
                        <div className="space-y-4">
                            {/* Applicant Info */}
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-xs text-muted-foreground">Nama Pemohon</Label>
                                    <p className="font-medium">{selectedEvent.extendedProps.user}</p>
                                    <p className="text-sm text-muted-foreground">{selectedEvent.extendedProps.user_email}</p>
                                </div>
                            </div>

                            {/* Organization */}
                            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label className="text-xs text-muted-foreground">Organisasi</Label>
                                    <p className="font-medium">{selectedEvent.extendedProps.organization}</p>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Ruangan</Label>
                                        <p className="font-medium">{selectedEvent.extendedProps.ruang}</p>
                                        <p className="text-sm text-muted-foreground">{selectedEvent.extendedProps.gedung}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Waktu</Label>
                                        <p className="font-medium">
                                            {format(new Date(selectedEvent.start), 'HH:mm', { locale: id })} - {format(new Date(selectedEvent.end), 'HH:mm', { locale: id })}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(selectedEvent.start), 'dd MMMM yyyy', { locale: id })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Jumlah Peserta</Label>
                                        <p className="font-medium">{selectedEvent.extendedProps.jumlah_peserta} orang</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
                                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Status</Label>
                                        <Badge variant="success" className="mt-1">
                                            {selectedEvent.extendedProps.status === 'approved_wd' ? 'Disetujui WD2' : 'Disetujui SCO'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Event Description */}
                            <div className="p-3 bg-muted rounded-md">
                                <Label className="text-xs text-muted-foreground">Nama Acara</Label>
                                <p className="mt-1">{selectedEvent.extendedProps.tujuan_peminjaman}</p>
                            </div>

                            {/* Document Download */}
                            {selectedEvent.extendedProps.surat_pengajuan && (
                                <div className="flex justify-end pt-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`/storage/${selectedEvent.extendedProps.surat_pengajuan}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Surat Pengajuan
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
