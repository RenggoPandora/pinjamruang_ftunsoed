<?php

namespace App\Http\Controllers;

use App\Models\ReservationRequest;
use App\Models\Gedung;
use App\Models\Ruang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KalenderController extends Controller
{
    public function index()
    {
        // Get all approved reservations (approved_sco or approved_wd)
        $reservations = ReservationRequest::with(['user', 'ruang.gedung', 'organisasi'])
            ->whereIn('status', ['approved_sco', 'approved_wd'])
            ->get();

        // Transform to FullCalendar events format
        $events = $reservations->map(function ($reservation) {
            $startDateTime = $reservation->tanggal . ' ' . $reservation->start_time;
            $endDateTime = $reservation->tanggal . ' ' . $reservation->end_time;

            return [
                'id' => (string) $reservation->id,
                'title' => $reservation->organisasi->name . ' - ' . $reservation->ruang->code,
                'start' => $startDateTime,
                'end' => $endDateTime,
                'backgroundColor' => 'oklch(0.3 0.08 255)', // Navy blue theme
                'borderColor' => 'oklch(0.3 0.08 255)',
                'extendedProps' => [
                    'organization' => $reservation->organisasi->name,
                    'gedung' => $reservation->ruang->gedung->name,
                    'ruang' => $reservation->ruang->code,
                    'user' => $reservation->user->name,
                    'jumlah_peserta' => $reservation->jumlah_orang,
                    'tujuan_peminjaman' => $reservation->deskripsi_acara,
                ],
            ];
        });

        // Get all gedungs and ruangs for filters
        $gedungs = Gedung::all(['id', 'name']);
        $ruangs = Ruang::all(['id', 'code', 'gedung_id']);

        return Inertia::render('kalender', [
            'events' => $events,
            'gedungs' => $gedungs,
            'ruangs' => $ruangs,
        ]);
    }
}
