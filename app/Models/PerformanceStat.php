<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceStat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'user_role',
        'stat_type',
        'stat_value',
        'period_type',
        'period_start',
        'period_end',
        'category',
        'last_updated_at',
        'next_update_due',
        'breakdown',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stat_value' => 'decimal:2',
        'period_start' => 'date',
        'period_end' => 'date',
        'last_updated_at' => 'datetime',
        'next_update_due' => 'datetime',
        'breakdown' => 'array',
    ];

    /**
     * Get the user that owns the performance stat.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include stats for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include stats for a specific role.
     */
    public function scopeForRole($query, $role)
    {
        return $query->where('user_role', $role);
    }

    /**
     * Scope a query to only include stats of a specific type.
     */
    public function scopeOfType($query, $statType)
    {
        return $query->where('stat_type', $statType);
    }

    /**
     * Scope a query to only include stats for a specific period type.
     */
    public function scopeForPeriod($query, $periodType)
    {
        return $query->where('period_type', $periodType);
    }

    /**
     * Scope a query to only include stats in a specific category.
     */
    public function scopeInCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include stats that need updating.
     */
    public function scopeNeedsUpdate($query)
    {
        return $query->where('next_update_due', '<', now());
    }
}
