import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useState, useRef } from 'react';
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
        jumlah_peserta: number;
        tujuan_peminjaman: string;
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
    const calendarRef = useRef<any>(null);
    const [selectedGedung, setSelectedGedung] = useState<string>('all');
    const [selectedRuang, setSelectedRuang] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [filteredEvents, setFilteredEvents] = useState(events);

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

    // Apply filters
    const applyFilters = () => {
        let filtered = [...events];

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

        setFilteredEvents(filtered);

        // Navigate calendar to selected month
        if (selectedMonth !== 'all' && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(selectedMonth + '-01');
        }
    };

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

    // Apply filters whenever selection changes
    useState(() => {
        applyFilters();
    });

    // Event click handler
    const handleEventClick = (info: any) => {
        const event = info.event;
        const props = event.extendedProps;
        
        const details = `
═══════════════════════════════════
DETAIL PEMINJAMAN RUANG
═══════════════════════════════════

📋 Organisasi: ${props.organization}
👤 Pemohon: ${props.user}

🏢 Lokasi: ${props.gedung} - ${props.ruang}
📅 Tanggal: ${format(new Date(event.start), 'dd MMMM yyyy', { locale: id })}
⏰ Waktu: ${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}
👥 Jumlah Peserta: ${props.jumlah_peserta} orang

📝 Tujuan:
${props.tujuan_peminjaman}

═══════════════════════════════════
        `.trim();

        alert(details);
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                            <div className="flex items-end">
                                <button
                                    onClick={applyFilters}
                                    className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Terapkan Filter
                                </button>
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
