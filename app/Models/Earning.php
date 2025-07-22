<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Earning extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'teaching_session_id',
        'amount',
        'currency',
        'status',
        'payout_date',
        'transaction_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'payout_date' => 'datetime',
    ];

    /**
     * Get the user that owns the earning.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the teaching session associated with the earning.
     */
    public function teachingSession(): BelongsTo
    {
        return $this->belongsTo(TeachingSession::class);
    }

    /**
     * Get the transaction associated with the earning.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(WalletTransaction::class);
    }

    /**
     * Scope a query to only include pending earnings.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include paid earnings.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope a query to only include cancelled earnings.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
}
