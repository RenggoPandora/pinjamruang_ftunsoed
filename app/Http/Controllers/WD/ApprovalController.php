<?php

namespace App\Http\Controllers\WD;

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

        // Check if request is pending WD approval
        if ($request->status !== 'pending_wd') {
            return redirect()->route('wd.beranda')
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
            'catatan_sco' => $request->catatan_sco,
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

        return Inertia::render('wd/approval', [
            'reservation' => $data,
        ]);
    }

    public function update(Request $request, $id)
    {
        $reservationRequest = ReservationRequest::findOrFail($id);

        // Validate request
        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
            'catatan_wd' => 'nullable|string',
        ]);

        // Check if request is pending WD approval
        if ($reservationRequest->status !== 'pending_wd') {
            return back()->with('error', 'Permintaan ini sudah diproses');
        }

        // Update based on action
        if ($validated['action'] === 'approve') {
            $reservationRequest->update([
                'status' => 'approved_wd',
                'catatan_wd' => $validated['catatan_wd'],
                'tanggal_approval_wd' => now(),
            ]);
            $message = 'Permintaan berhasil disetujui';
        } else {
            $reservationRequest->update([
                'status' => 'rejected_wd',
                'catatan_wd' => $validated['catatan_wd'],
                'tanggal_approval_wd' => now(),
            ]);
            $message = 'Permintaan berhasil ditolak';
        }

        return redirect()->route('wd.beranda')
            ->with('success', $message);
    }
}
