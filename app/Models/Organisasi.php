<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organisasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
    ];

    /**
     * Get the reservation requests for the organisasi.
     */
    public function reservationRequests(): HasMany
    {
        return $this->hasMany(ReservationRequest::class);
    }
}
