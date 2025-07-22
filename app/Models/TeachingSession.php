<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeachingSession extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teacher_id',
        'student_id',
        'guardian_id',
        'scheduled_start_time',
        'scheduled_end_time',
        'actual_start_time',
        'actual_end_time',
        'duration_minutes',
        'subject',
        'subscription_plan_id',
        'session_topic',
        'session_objectives',
        'teaching_method',
        'status',
        'teacher_notes',
        'student_notes',
        'guardian_notes',
        'meeting_link',
        'recording_link',
        'resources_used',
        'homework_assigned',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_start_time' => 'datetime',
        'scheduled_end_time' => 'datetime',
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
        'duration_minutes' => 'integer',
        'resources_used' => 'array',
    ];

    /**
     * Get the teacher for the session.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the student for the session.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the guardian for the session.
     */
    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    /**
     * Get the subscription plan for the session.
     */
    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    /**
     * Get the ratings for the session.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Get the subject name, preferring the subscription plan name if available.
     * 
     * @return string
     */
    public function getSubjectNameAttribute(): string
    {
        return $this->subscriptionPlan->name ?? $this->subject;
    }

    /**
     * Get an array of subject names based on the subject field and subscription plan.
     * 
     * @return array
     */
    public function getSubjectNamesAttribute(): array
    {
        // Start with the main subject
        $subjects = [$this->subject];
        
        // Add subjects from subscription plan if available
        if ($this->subscriptionPlan) {
            $planName = strtolower($this->subscriptionPlan->name);
            
            // Extract subjects based on plan name keywords
            if (strpos($planName, 'quran') !== false) {
                $subjects[] = 'Quran Reading';
                if (strpos($planName, 'memorization') !== false || strpos($planName, 'hifz') !== false) {
                    $subjects[] = 'Quran Memorization';
                }
            }
            
            if (strpos($planName, 'tajweed') !== false) {
                $subjects[] = 'Tajweed Rules';
            }
            
            if (strpos($planName, 'arabic') !== false) {
                $subjects[] = 'Arabic Language';
            }
            
            if (strpos($planName, 'islamic') !== false || strpos($planName, 'studies') !== false) {
                $subjects[] = 'Islamic Studies';
            }
            
            if (strpos($planName, 'fiqh') !== false || strpos($planName, 'jurisprudence') !== false) {
                $subjects[] = 'Fiqh (Jurisprudence)';
            }
        }
        
        // Remove duplicates and return
        return array_unique($subjects);
    }

    /**
     * Get the image for this teaching session from its subscription plan.
     * 
     * @return string|null
     */
    public function getImageAttribute(): ?string
    {
        return $this->subscriptionPlan->image ?? '/assets/images/classes/default.png';
    }

    /**
     * Scope a query to only include upcoming sessions.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_start_time', '>', now())
                    ->whereNotIn('status', ['completed', 'cancelled_by_teacher', 'cancelled_by_student', 'cancelled_by_guardian', 'cancelled_by_admin', 'no_show']);
    }

    /**
     * Scope a query to only include past sessions.
     */
    public function scopePast($query)
    {
        return $query->where(function($q) {
            $q->where('scheduled_start_time', '<', now())
              ->orWhereIn('status', ['completed', 'cancelled_by_teacher', 'cancelled_by_student', 'cancelled_by_guardian', 'cancelled_by_admin', 'no_show']);
        });
    }

    /**
     * Scope a query to only include completed sessions.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include sessions for a specific teacher.
     */
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    /**
     * Scope a query to only include sessions for a specific student.
     */
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
