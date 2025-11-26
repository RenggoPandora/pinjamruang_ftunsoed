<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ruang extends Model
{
    use HasFactory;

    protected $fillable = [
        'gedung_id',
        'code',
        'name',
        'is_aula',
    ];

    protected $casts = [
        'is_aula' => 'boolean',
    ];

    /**
     * Get the gedung that owns the ruang.
     */
    public function gedung(): BelongsTo
    {
        return $this->belongsTo(Gedung::class);
    }

    /**
     * Get the reservation requests for the ruang.
     */
    public function reservationRequests(): HasMany
    {
        return $this->hasMany(ReservationRequest::class);
    }
}
