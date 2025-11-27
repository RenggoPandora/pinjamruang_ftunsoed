<?php

namespace App\Http\Controllers\WD;

use App\Http\Controllers\Controller;
use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BerandaController extends Controller
{
    public function index()
    {
        // Get statistics for WD dashboard (only Aula reservations)
        $statistics = [
            'total_pending' => ReservationRequest::where('status', 'pending_wd')->count(),
            'total_approved' => ReservationRequest::where('status', 'approved_wd')->count(),
            'total_rejected' => ReservationRequest::where('status', 'rejected_wd')->count(),
        ];

        // Get pending requests (status: pending_wd)
        $pendingRequests = ReservationRequest::with(['user', 'ruang.gedung', 'organisasi'])
            ->where('status', 'pending_wd')
            ->latest()
            ->get();

        // Detect scheduling conflicts (including overlapping times)
        $pendingRequests = $pendingRequests->map(function ($request) use ($pendingRequests) {
            $hasConflict = false;
            $conflictCount = 0;

            // Check for conflicts with other requests
            foreach ($pendingRequests as $otherRequest) {
                // Skip self-comparison
                if ($request->id === $otherRequest->id) {
                    continue;
                }

                // Check if same room and same date
                if ($request->ruang_id === $otherRequest->ruang_id &&
                    $request->tanggal->format('Y-m-d') === $otherRequest->tanggal->format('Y-m-d')) {

                    // Check if times overlap
                    $start1 = strtotime($request->start_time);
                    $end1 = strtotime($request->end_time);
                    $start2 = strtotime($otherRequest->start_time);
                    $end2 = strtotime($otherRequest->end_time);

                    // Times overlap if: start1 < end2 AND end1 > start2
                    if ($start1 < $end2 && $end1 > $start2) {
                        $hasConflict = true;
                        $conflictCount++;
                    }
                }
            }

            return [
                'id' => $request->id,
                'tanggal' => $request->tanggal,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'status' => $request->status,
                'deskripsi_acara' => $request->deskripsi_acara,
                'jumlah_orang' => $request->jumlah_orang,
                'has_conflict' => $hasConflict,
                'conflict_count' => $conflictCount,
                'applicant' => [
                    'name' => $request->user->name,
                    'email' => $request->user->email,
                ],
                'ruang' => [
                    'code' => $request->ruang->code,
                    'name' => $request->ruang->name,
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

        // Count new requests forwarded by SCO (created within last 24 hours)
        $newRequestsCount = ReservationRequest::where('status', 'pending_wd')
            ->where('tanggal_approval_sco', '>=', now()->subDay())
            ->count();

        return Inertia::render('wd/beranda', [
            'statistics' => $statistics,
            'pendingRequests' => $pendingRequests,
            'newRequestsCount' => $newRequestsCount,
        ]);
    }
}
