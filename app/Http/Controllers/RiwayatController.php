<?php

namespace App\Http\Controllers;

use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get all reservations for the current user
        $reservations = ReservationRequest::with(['ruang.gedung', 'organisasi'])
            ->where('applicant_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate statistics
        $statistics = [
            'total' => $reservations->count(),
            'approved' => $reservations->whereIn('status', ['approved_sco', 'approved_wd'])->count(),
            'rejected' => $reservations->whereIn('status', ['rejected_sco', 'rejected_wd'])->count(),
            'pending' => $reservations->whereIn('status', ['pending', 'pending_wd'])->count(),
        ];

        return Inertia::render('riwayat', [
            'reservations' => $reservations,
            'statistics' => $statistics,
        ]);
    }
}
