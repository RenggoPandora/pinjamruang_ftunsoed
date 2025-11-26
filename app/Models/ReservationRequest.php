<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_id',
        'ruang_id',
        'organisasi_id',
        'tanggal',
        'start_time',
        'end_time',
        'jumlah_orang',
        'deskripsi_acara',
        'surat_pengajuan',
        'status',
        'catatan_sco',
        'catatan_wd',
        'tanggal_approval_sco',
        'tanggal_approval_wd',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'tanggal_approval_sco' => 'datetime',
        'tanggal_approval_wd' => 'datetime',
    ];

    /**
     * Get the applicant (user) that owns the reservation request.
     */
    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    /**
     * Alias for applicant relationship.
     */
    public function user(): BelongsTo
    {
        return $this->applicant();
    }

    /**
     * Get the ruang that owns the reservation request.
     */
    public function ruang(): BelongsTo
    {
        return $this->belongsTo(Ruang::class);
    }

    /**
     * Get the organisasi that owns the reservation request.
     */
    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class);
    }

    /**
     * Check if the request is pending for SCO approval.
     */
    public function isPendingSCO(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the request is pending for WD approval.
     */
    public function isPendingWD(): bool
    {
        return $this->status === 'pending_wd';
    }

    /**
     * Check if the request is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved_wd';
    }

    /**
     * Check if the request is rejected.
     */
    public function isRejected(): bool
    {
        return in_array($this->status, ['rejected_sco', 'rejected_wd']);
    }
}
