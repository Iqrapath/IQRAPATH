<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
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
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'is_recurring',
        'specific_date',
        'title',
        'notes',
        'timezone',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'specific_date' => 'date',
        'is_available' => 'boolean',
        'is_recurring' => 'boolean',
    ];

    /**
     * Get the formatted start time.
     *
     * @return string
     */
    public function getStartTimeAttribute($value)
    {
        return $this->asDateTime($value)->format('H:i');
    }

    /**
     * Get the formatted end time.
     *
     * @return string
     */
    public function getEndTimeAttribute($value)
    {
        return $this->asDateTime($value)->format('H:i');
    }

    /**
     * Get the user that owns the schedule.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who updated the schedule.
     */
    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to only include available schedules.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to only include schedules for a specific day.
     */
    public function scopeForDay($query, $day)
    {
        return $query->where('day_of_week', $day);
    }

    /**
     * Scope a query to only include schedules for a specific role.
     */
    public function scopeForRole($query, $role)
    {
        return $query->where('user_role', $role);
    }

    /**
     * Scope a query to only include schedules for a specific date range.
     */
    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->where(function($q) use ($startDate, $endDate) {
            // Include recurring schedules
            $q->where('is_recurring', true);
            
            // Or specific dates within range
            $q->orWhere(function($subQ) use ($startDate, $endDate) {
                $subQ->where('is_recurring', false)
                    ->whereBetween('specific_date', [$startDate, $endDate]);
            });
        });
    }
}
