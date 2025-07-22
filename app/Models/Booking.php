<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_reference',
        'student_id',
        'teacher_id',
        'subject_id',
        'schedule_id',
        'date',
        'start_time',
        'end_time',
        'duration',
        'status',
        'notes',
        'previous_booking_id',
        'cancellation_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'duration' => 'integer',
        'cancelled_at' => 'datetime',
        'rescheduled_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate booking reference when creating a new booking
        static::creating(function ($booking) {
            if (!$booking->booking_reference) {
                $booking->booking_reference = self::generateBookingReference();
            }
        });
    }

    /**
     * Generate a unique booking reference.
     */
    public static function generateBookingReference(): string
    {
        $date = now()->format('ymd');
        $random = strtoupper(substr(uniqid(), -4));
        $reference = "BK-{$date}-{$random}";

        // Ensure uniqueness
        while (self::where('booking_reference', $reference)->exists()) {
            $random = strtoupper(substr(uniqid(), -4));
            $reference = "BK-{$date}-{$random}";
        }

        return $reference;
    }

    /**
     * Get the student associated with this booking.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the teacher associated with this booking.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the subject associated with this booking.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the schedule associated with this booking.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    /**
     * Get the previous booking if this is a rescheduled booking.
     */
    public function previousBooking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'previous_booking_id');
    }

    /**
     * Get the rescheduled bookings from this booking.
     */
    public function rescheduledBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'previous_booking_id');
    }

    /**
     * Approve this booking.
     */
    public function approve()
    {
        $this->status = 'approved';
        $this->approved_at = now();
        $this->save();
        
        return $this;
    }

    /**
     * Reject this booking.
     */
    public function reject($reason = null)
    {
        $this->status = 'rejected';
        $this->rejected_at = now();
        
        if ($reason) {
            $this->cancellation_reason = $reason;
        }
        
        $this->save();
        
        return $this;
    }

    /**
     * Mark this booking as completed.
     */
    public function complete()
    {
        $this->status = 'completed';
        $this->completed_at = now();
        $this->save();
        
        return $this;
    }

    /**
     * Cancel this booking.
     */
    public function cancel($reason = null)
    {
        $this->status = 'cancelled';
        $this->cancelled_at = now();
        
        if ($reason) {
            $this->cancellation_reason = $reason;
        }
        
        $this->save();
        
        return $this;
    }

    /**
     * Mark this booking as missed.
     */
    public function miss()
    {
        $this->status = 'missed';
        $this->save();
        
        return $this;
    }

    /**
     * Check if there is a booking conflict for the teacher.
     */
    public static function hasTeacherConflict($teacherId, $date, $startTime, $endTime, $excludeBookingId = null)
    {
        $query = self::where('teacher_id', $teacherId)
            ->where('date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                // Check if the new booking overlaps with existing bookings
                $query->where(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<=', $startTime)
                      ->where('end_time', '>', $startTime);
                })->orWhere(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<', $endTime)
                      ->where('end_time', '>=', $endTime);
                })->orWhere(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '>=', $startTime)
                      ->where('end_time', '<=', $endTime);
                });
            })
            ->whereIn('status', ['approved', 'upcoming', 'pending']);
            
        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }
            
        return $query->exists();
    }
}
