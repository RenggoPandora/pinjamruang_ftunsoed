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

        // Get all reservations for the current user
        $reservations = ReservationRequest::with(['ruang.gedung', 'organisasi'])
            ->where('applicant_id', $user->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        // Get approved dates for calendar
        $approvedDates = ReservationRequest::where('applicant_id', $user->id)
            ->whereIn('status', ['approved_sco', 'approved_wd'])
            ->pluck('tanggal')
            ->toArray();

        return Inertia::render('beranda', [
            'reservations' => $reservations,
            'approvedDates' => $approvedDates,
        ]);
    }
}
