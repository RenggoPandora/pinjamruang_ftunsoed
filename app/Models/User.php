<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the reservation requests for the user (applicant).
     */
    public function reservationRequests(): HasMany
    {
        return $this->hasMany(ReservationRequest::class, 'applicant_id');
    }

    /**
     * Check if user is an applicant.
     */
    public function isApplicant(): bool
    {
        return $this->role === 'APP';
    }

    /**
     * Check if user is a sub coordinator.
     */
    public function isSubCoordinator(): bool
    {
        return $this->role === 'SCO';
    }

    /**
     * Check if user is WD2.
     */
    public function isWD(): bool
    {
        return $this->role === 'WD';
    }
}
