<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'education_level',
        'age_group',
        'school_name',
        'grade_level',
        'subjects_of_interest',
        'learning_goals',
        'learning_difficulties',
        'learning_style',
        'guardian_id',
        'preferred_learning_method',
        'preferred_teacher_gender',
        'total_sessions_attended',
        'attendance_rate',
        'last_session_at',
        'teacher_feedback',
        'medical_information',
        'emergency_contact',
        'emergency_contact_relationship',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Set age_group based on date_of_birth if not already set
            if (!$model->age_group && $model->date_of_birth) {
                $age = $model->date_of_birth->age;
                $model->age_group = $age < 13 ? 'child' : ($age < 18 ? 'teenager' : 'adult');
            }
        });

        static::updating(function ($model) {
            // Update age_group if date_of_birth changes
            if ($model->isDirty('date_of_birth') && $model->date_of_birth) {
                $age = $model->date_of_birth->age;
                $model->age_group = $age < 13 ? 'child' : ($age < 18 ? 'teenager' : 'adult');
            }
        });
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'subjects_of_interest' => 'array',
        'total_sessions_attended' => 'integer',
        'attendance_rate' => 'decimal:2',
        'last_session_at' => 'datetime',
    ];

    /**
     * Get the user that owns the student profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the guardian of the student.
     */
    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    /**
     * Get the learning sessions for this student.
     */
    public function learningSessions(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'student_id', 'user_id');
    }

    /**
     * Get the schedules for this student.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'user_id', 'user_id')
            ->where('user_role', 'student');
    }

    /**
     * Get the documents for this student.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DocumentUpload::class, 'user_id', 'user_id')
            ->where('user_role', 'student');
    }

    /**
     * Get the performance stats for this student.
     */
    public function performanceStats(): HasMany
    {
        return $this->hasMany(PerformanceStat::class, 'user_id', 'user_id')
            ->where('user_role', 'student');
    }

    /**
     * Get the ratings given by this student.
     */
    public function ratingsGiven(): HasMany
    {
        return $this->hasMany(Rating::class, 'rater_id', 'user_id');
    }

    /**
     * Update attendance statistics.
     */
    public function updateAttendanceStatistics(): void
    {
        $sessions = $this->learningSessions()
            ->whereIn('status', ['completed', 'no_show', 'cancelled_by_student'])
            ->get();

        $this->total_sessions_attended = $sessions->where('status', 'completed')->count();

        $totalScheduledSessions = $sessions->count();

        if ($totalScheduledSessions > 0) {
            $this->attendance_rate = ($this->total_sessions_attended / $totalScheduledSessions) * 100;
        }

        $lastCompletedSession = $this->learningSessions()
            ->where('status', 'completed')
            ->orderBy('actual_end_time', 'desc')
            ->first();

        if ($lastCompletedSession) {
            $this->last_session_at = $lastCompletedSession->actual_end_time;
        }

        $this->save();
    }
}
