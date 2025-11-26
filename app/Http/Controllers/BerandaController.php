<?php

namespace App\Http\Controllers;

use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all reservations from all applicants
        $reservations = ReservationRequest::with(['ruang.gedung', 'organisasi', 'user'])
            ->orderBy('tanggal', 'desc')
            ->get();

        // Get approved dates for calendar (all approved reservations)
        $approvedDates = ReservationRequest::whereIn('status', ['approved_sco', 'approved_wd'])
            ->pluck('tanggal')
            ->toArray();

        return Inertia::render('beranda', [
            'reservations' => $reservations,
            'approvedDates' => $approvedDates,
        ]);
    }
}
