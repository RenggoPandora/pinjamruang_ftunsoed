<?php

namespace App\Http\Controllers\SCO;

use App\Http\Controllers\Controller;
use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    public function show($id)
    {
        $request = ReservationRequest::with(['user', 'ruang.gedung', 'organisasi'])
            ->findOrFail($id);

        // Check if request is pending
        if ($request->status !== 'pending') {
            return redirect()->route('sco.beranda')
                ->with('error', 'Permintaan ini sudah diproses');
        }

        $data = [
            'id' => $request->id,
            'tanggal' => $request->tanggal,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => $request->status,
            'deskripsi_acara' => $request->deskripsi_acara,
            'jumlah_orang' => $request->jumlah_orang,
            'surat_pengajuan' => $request->surat_pengajuan,
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
                'code' => $request->organisasi->code ?? '-',
            ],
            'created_at' => $request->created_at,
        ];

        return Inertia::render('sco/approval', [
            'reservation' => $data,
        ]);
    }

    public function update(Request $request, $id)
    {
        $reservationRequest = ReservationRequest::findOrFail($id);

        // Validate request
        $validated = $request->validate([
            'action' => 'required|in:approve,forward,reject',
            'catatan_sco' => 'nullable|string',
        ]);

        // Check if request is still pending
        if ($reservationRequest->status !== 'pending') {
            return back()->with('error', 'Permintaan ini sudah diproses');
        }

        // Update based on action
        switch ($validated['action']) {
            case 'approve':
                // Approve directly for non-Aula rooms
                $reservationRequest->update([
                    'status' => 'approved_sco',
                    'catatan_sco' => $validated['catatan_sco'],
                    'tanggal_approval_sco' => now(),
                ]);
                $message = 'Permintaan berhasil disetujui';
                break;

            case 'forward':
                // Forward to WD for Aula
                $reservationRequest->update([
                    'status' => 'pending_wd',
                    'catatan_sco' => $validated['catatan_sco'],
                    'tanggal_approval_sco' => now(),
                ]);
                $message = 'Permintaan berhasil diteruskan ke WD2';
                break;

            case 'reject':
                // Reject request
                $reservationRequest->update([
                    'status' => 'rejected_sco',
                    'catatan_sco' => $validated['catatan_sco'],
                    'tanggal_approval_sco' => now(),
                ]);
                $message = 'Permintaan berhasil ditolak';
                break;
        }

        return redirect()->route('sco.beranda')
            ->with('success', $message);
    }
}
