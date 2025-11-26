<?php

namespace App\Http\Controllers\SCO;

use App\Http\Controllers\Controller;
use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index()
    {
        // Get statistics for SCO dashboard
        $statistics = [
            'total_pending' => ReservationRequest::where('status', 'pending')->count(),
            'total_approved' => ReservationRequest::whereIn('status', ['approved_sco', 'approved_wd'])->count(),
            'total_rejected' => ReservationRequest::whereIn('status', ['rejected_sco', 'rejected_wd'])->count(),
        ];

        // Get pending requests (status: pending)
        $pendingRequests = ReservationRequest::with(['user', 'ruang.gedung', 'organisasi'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'tanggal' => $request->tanggal,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'status' => $request->status,
                    'deskripsi_acara' => $request->deskripsi_acara,
                    'jumlah_orang' => $request->jumlah_orang,
                    'applicant' => [
                        'name' => $request->user->name,
                        'email' => $request->user->email,
                    ],
                    'ruang' => [
                        'code' => $request->ruang->code,
                        'name' => $request->ruang->name,
                        'is_aula' => $request->ruang->is_aula,
                        'gedung' => [
                            'name' => $request->ruang->gedung->name,
                        ],
                    ],
                    'organisasi' => [
                        'name' => $request->organisasi->name,
                    ],
                    'created_at' => $request->created_at,
                ];
            });

        // Count new requests (created within last 24 hours)
        $newRequestsCount = ReservationRequest::where('status', 'pending')
            ->where('created_at', '>=', now()->subDay())
            ->count();

        return Inertia::render('sco/beranda', [
            'statistics' => $statistics,
            'pendingRequests' => $pendingRequests,
            'newRequestsCount' => $newRequestsCount,
        ]);
    }
}
