<?php

namespace App\Http\Controllers;

use App\Models\Gedung;
use App\Models\Organisasi;
use App\Models\ReservationRequest;
use App\Models\Ruang;
use App\Models\User;
use App\Notifications\NewReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    public function index()
    {
        $gedungs = Gedung::all();
        $ruangs = Ruang::with('gedung')->get();
        $organisasis = Organisasi::all();

        return Inertia::render('peminjaman', [
            'gedungs' => $gedungs,
            'ruangs' => $ruangs,
            'organisasis' => $organisasis,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ruang_id' => 'required|exists:ruangs,id',
            'organisasi_id' => 'required|exists:organisasis,id',
            'tanggal' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'jumlah_orang' => 'required|integer|min:1',
            'deskripsi_acara' => 'required|string|max:1000',
            'surat_pengajuan' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
        ]);

        // Handle file upload
        if ($request->hasFile('surat_pengajuan')) {
            $file = $request->file('surat_pengajuan');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('surat_pengajuan', $filename, 'public');
            $validated['surat_pengajuan'] = $path;
        }

        // Create reservation request
        $validated['applicant_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        $reservationRequest = ReservationRequest::create($validated);

        // Send notification to all SCO users
        $scoUsers = User::where('role', 'sco')->get();
        foreach ($scoUsers as $scoUser) {
            $scoUser->notify(new NewReservationRequest($reservationRequest->fresh(['user', 'ruang.gedung', 'organisasi']), 'sco'));
        }

        return redirect()->route('beranda')->with('success', 'Peminjaman berhasil diajukan!');
    }
}
