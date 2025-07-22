<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuardianProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'relationship_to_student',
        'occupation',
        'secondary_phone',
        'secondary_email',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'receive_progress_reports',
        'receive_session_notifications',
        'preferred_contact_method',
        'billing_name',
        'billing_address',
        'tax_id',
        'alternate_contact_name',
        'alternate_contact_relationship',
        'alternate_contact_phone',
        'last_login_at',
        'total_students_managed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'receive_progress_reports' => 'boolean',
        'receive_session_notifications' => 'boolean',
        'last_login_at' => 'datetime',
        'total_students_managed' => 'integer',
    ];

    /**
     * Get the user that owns the guardian profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the students associated with this guardian.
     */
    public function students(): HasMany
    {
        return $this->hasMany(StudentProfile::class, 'guardian_id', 'user_id');
    }

    /**
     * Get the documents for this guardian.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DocumentUpload::class, 'user_id', 'user_id')
            ->where('user_role', 'guardian');
    }

    /**
     * Get the guardian sessions for this guardian.
     */
    public function guardianSessions(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'guardian_id', 'user_id');
    }

    /**
     * Update student count.
     */
    public function updateStudentCount(): void
    {
        $this->total_students_managed = $this->students()->count();
        $this->save();
    }
}
