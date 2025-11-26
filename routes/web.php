<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\BerandaController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\RiwayatController;
use App\Http\Controllers\KalenderController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\SCO\BerandaController as SCOBerandaController;
use App\Http\Controllers\SCO\ApprovalController as SCOApprovalController;
use App\Http\Controllers\WD\BerandaController as WDBerandaController;
use App\Http\Controllers\WD\ApprovalController as WDApprovalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Google OAuth Routes
Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect dashboard based on user role
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        if ($user->role === 'SCO') {
            return redirect()->route('sco.beranda');
        } elseif ($user->role === 'WD') {
            return redirect()->route('wd.beranda');
        }
        
        return redirect()->route('beranda');
    })->name('dashboard');

    // Applicant Routes
    Route::get('beranda', [BerandaController::class, 'index'])->name('beranda');
    Route::get('peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::post('peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::get('riwayat', [RiwayatController::class, 'index'])->name('riwayat');
    Route::get('detail/{id}', [DetailController::class, 'show'])->name('detail.show');

    // Global Calendar (All Roles)
    Route::get('kalender', [KalenderController::class, 'index'])->name('kalender');

    // SCO Routes
    Route::prefix('sco')->name('sco.')->group(function () {
        Route::get('beranda', [SCOBerandaController::class, 'index'])->name('beranda');
        Route::get('approval/{id}', [SCOApprovalController::class, 'show'])->name('approval.show');
        Route::post('approval/{id}', [SCOApprovalController::class, 'update'])->name('approval.update');
    });

    // WD Routes
    Route::prefix('wd')->name('wd.')->group(function () {
        Route::get('beranda', [WDBerandaController::class, 'index'])->name('beranda');
        Route::get('approval/{id}', [WDApprovalController::class, 'show'])->name('approval.show');
        Route::post('approval/{id}', [WDApprovalController::class, 'update'])->name('approval.update');
    });
});

require __DIR__.'/settings.php';
