<?php

namespace App\Http\Controllers;

use App\Models\ReservationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function show(Request $request, $id)
    {
        $reservation = ReservationRequest::with(['ruang.gedung', 'organisasi'])
            ->where('id', $id)
            ->where('applicant_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('detail', [
            'reservation' => $reservation
        ]);
    }
}
