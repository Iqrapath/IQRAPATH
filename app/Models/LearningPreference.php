<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningPreference extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'preferred_subjects',
        'teaching_mode',
        'student_age_group',
        'preferred_learning_times',
        'additional_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'preferred_subjects' => 'array',
        'preferred_learning_times' => 'array',
    ];

    /**
     * Get the user that owns the learning preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
