<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rating extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'rater_id',
        'ratee_id',
        'teaching_session_id',
        'category',
        'rating_value',
        'review_text',
        'skill_ratings',
        'is_public',
        'is_anonymous',
        'is_flagged',
        'flagged_reason',
        'moderated_by',
        'moderated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating_value' => 'decimal:1',
        'skill_ratings' => 'array',
        'is_public' => 'boolean',
        'is_anonymous' => 'boolean',
        'is_flagged' => 'boolean',
        'moderated_at' => 'datetime',
    ];

    /**
     * Get the user who gave the rating.
     */
    public function rater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    /**
     * Get the user who received the rating.
     */
    public function ratee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ratee_id');
    }

    /**
     * Get the teaching session for the rating.
     */
    public function teachingSession(): BelongsTo
    {
        return $this->belongsTo(TeachingSession::class);
    }

    /**
     * Get the moderator who reviewed the rating.
     */
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    /**
     * Scope a query to only include public ratings.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope a query to only include ratings for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('ratee_id', $userId);
    }

    /**
     * Scope a query to only include ratings in a specific category.
     */
    public function scopeInCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include flagged ratings.
     */
    public function scopeFlagged($query)
    {
        return $query->where('is_flagged', true);
    }
}
