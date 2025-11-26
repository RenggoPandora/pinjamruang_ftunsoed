<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gedung extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Get the ruangs for the gedung.
     */
    public function ruangs(): HasMany
    {
        return $this->hasMany(Ruang::class);
    }
}
