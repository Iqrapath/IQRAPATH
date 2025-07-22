<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'bio',
        'years_of_experience',
        'teaching_subjects',
        'specialization',
        'teaching_type',
        'teaching_mode',
        'teaching_languages',
        'availability_schedule',
        'overall_rating',
        'total_reviews',
        'total_sessions_taught',
        'is_verified',
        'last_active_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'teaching_subjects' => 'array',
        'teaching_languages' => 'array',
        'availability_schedule' => 'array',
        'overall_rating' => 'decimal:1',
        'total_reviews' => 'integer',
        'total_sessions_taught' => 'integer',
        'is_verified' => 'boolean',
        'last_active_at' => 'datetime',
    ];

    /**
     * Get the user that owns the teacher profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the teaching sessions for this teacher.
     */
    public function teachingSessions(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'teacher_id', 'user_id');
    }

    /**
     * Get the schedules for this teacher.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'user_id', 'user_id')
            ->where('user_role', 'teacher');
    }

    /**
     * Get the documents for this teacher.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DocumentUpload::class, 'user_id', 'user_id')
            ->where('user_role', 'teacher');
    }

    /**
     * Get ID verification documents.
     */
    public function idDocuments(): HasMany
    {
        return $this->documents()->where('document_type', 'id_verification');
    }

    /**
     * Get certificate documents.
     */
    public function certificates(): HasMany
    {
        return $this->documents()->where('document_type', 'certificate');
    }

    /**
     * Get CV/Resume documents.
     */
    public function cvDocuments(): HasMany
    {
        return $this->documents()->where('document_type', 'cv');
    }

    /**
     * Get the performance stats for this teacher.
     */
    public function performanceStats(): HasMany
    {
        return $this->hasMany(PerformanceStat::class, 'user_id', 'user_id')
            ->where('user_role', 'teacher');
    }

    /**
     * Get the ratings received by this teacher.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'ratee_id', 'user_id');
    }

    /**
     * Update rating statistics from all ratings.
     */
    public function updateRatingStatistics(): void
    {
        $ratings = $this->ratings()->get();

        $this->total_reviews = $ratings->where('category', 'overall')->count();

        if ($this->total_reviews > 0) {
            // Calculate overall rating
            $this->overall_rating = $ratings->where('category', 'overall')->avg('rating_value') ?? 0;
            
            // Update total sessions taught based on unique teaching sessions with ratings
            $uniqueSessionsWithRatings = $ratings->pluck('teaching_session_id')->unique()->count();
            
            // Only update if we have actual session data
            if ($uniqueSessionsWithRatings > 0 && $this->total_sessions_taught < $uniqueSessionsWithRatings) {
                $this->total_sessions_taught = $uniqueSessionsWithRatings;
            }
        }

        $this->save();
    }

    /**
     * Calculate profile completion percentage.
     */
    public function getProfileCompletionPercentage(): int
    {
        $fields = [
            $this->bio,
            $this->years_of_experience,
            $this->teaching_subjects,
            $this->specialization,
            $this->teaching_type,
            $this->teaching_mode,
            $this->teaching_languages,
            $this->availability_schedule
        ];
        
        $completedFields = array_filter($fields, function($field) {
            return !empty($field);
        });
        
        // Check if required documents are uploaded
        $hasIdVerification = $this->idDocuments()->exists();
        $hasCertificate = $this->certificates()->exists();
        $hasCV = $this->cvDocuments()->exists();
        
        $totalFields = count($fields) + 3; // +3 for the document types
        $completedCount = count($completedFields) + ($hasIdVerification ? 1 : 0) + 
                         ($hasCertificate ? 1 : 0) + ($hasCV ? 1 : 0);
        
        return intval(($completedCount / $totalFields) * 100);
    }
}
