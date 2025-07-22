<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VerificationRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teacher_id',
        'status',
        'video_status',
        'scheduled_date',
        'video_platform',
        'meeting_link',
        'meeting_notes',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_VERIFIED = 'verified';
    const STATUS_REJECTED = 'rejected';
    const STATUS_LIVE_VIDEO = 'live_video';

    /**
     * Video status constants
     */
    const VIDEO_NOT_SCHEDULED = 'not_scheduled';
    const VIDEO_SCHEDULED = 'scheduled';
    const VIDEO_COMPLETED = 'completed';
    const VIDEO_MISSED = 'missed';

    /**
     * Get the teacher that owns the verification request.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the admin who reviewed the verification request.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the documents associated with this verification request.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DocumentUpload::class);
    }

    /**
     * Get ID verification documents.
     */
    public function idDocuments(): HasMany
    {
        return $this->documents()->where(function($query) {
            $query->where('document_type', DocumentUpload::TYPE_ID_FRONT)
                  ->orWhere('document_type', DocumentUpload::TYPE_ID_BACK);
        });
    }

    /**
     * Get certificate documents.
     */
    public function certificates(): HasMany
    {
        return $this->documents()->where('document_type', DocumentUpload::TYPE_CERTIFICATE);
    }

    /**
     * Get resume document.
     */
    public function resume(): HasMany
    {
        return $this->documents()->where('document_type', DocumentUpload::TYPE_RESUME);
    }

    /**
     * Check if the verification request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the verification request is verified.
     */
    public function isVerified(): bool
    {
        return $this->status === self::STATUS_VERIFIED;
    }

    /**
     * Check if the verification request is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    /**
     * Check if the verification request is in live video status.
     */
    public function isLiveVideo(): bool
    {
        return $this->status === self::STATUS_LIVE_VIDEO;
    }

    /**
     * Check if the verification request has been reviewed.
     */
    public function isReviewed(): bool
    {
        return in_array($this->status, [
            self::STATUS_VERIFIED, 
            self::STATUS_REJECTED, 
            self::STATUS_LIVE_VIDEO
        ]);
    }

    /**
     * Check if the video verification is scheduled.
     */
    public function isVideoScheduled(): bool
    {
        return $this->video_status === self::VIDEO_SCHEDULED;
    }

    /**
     * Check if the video verification is completed.
     */
    public function isVideoCompleted(): bool
    {
        return $this->video_status === self::VIDEO_COMPLETED;
    }

    /**
     * Check if all required documents are uploaded.
     */
    public function hasAllRequiredDocuments(): bool
    {
        $hasFrontId = $this->documents()
            ->where('document_type', DocumentUpload::TYPE_ID_FRONT)
            ->exists();
            
        $hasBackId = $this->documents()
            ->where('document_type', DocumentUpload::TYPE_ID_BACK)
            ->exists();
            
        $hasCertificate = $this->documents()
            ->where('document_type', DocumentUpload::TYPE_CERTIFICATE)
            ->exists();
            
        $hasResume = $this->documents()
            ->where('document_type', DocumentUpload::TYPE_RESUME)
            ->exists();
            
        return $hasFrontId && $hasBackId && $hasCertificate && $hasResume;
    }

    /**
     * Approve the verification request.
     * 
     * @param int $adminId The ID of the admin approving the request
     * @return bool
     */
    public function approve(int $adminId): bool
    {
        // Update the verification request
        $this->status = self::STATUS_VERIFIED;
        $this->reviewed_by = $adminId;
        $this->reviewed_at = now();
        
        // If video verification was scheduled but not completed, mark it as completed
        if ($this->video_status === self::VIDEO_SCHEDULED) {
            $this->video_status = self::VIDEO_COMPLETED;
        }
        
        // Update all associated documents
        $this->documents()->update([
            'verification_status' => DocumentUpload::STATUS_VERIFIED,
            'verified_by' => $adminId,
            'verified_at' => now(),
        ]);
        
        // Update the teacher profile
        $teacherProfile = TeacherProfile::where('user_id', $this->teacher_id)->first();
        if ($teacherProfile) {
            $teacherProfile->is_verified = true;
            $teacherProfile->save();
        }
        
        return $this->save();
    }

    /**
     * Reject the verification request.
     * 
     * @param int $adminId The ID of the admin rejecting the request
     * @param string $reason The reason for rejection
     * @return bool
     */
    public function reject(int $adminId, string $reason): bool
    {
        $this->status = self::STATUS_REJECTED;
        $this->reviewed_by = $adminId;
        $this->reviewed_at = now();
        $this->rejection_reason = $reason;
        
        // If video verification was scheduled, mark it as completed since we've made a decision
        if ($this->video_status === self::VIDEO_SCHEDULED) {
            $this->video_status = self::VIDEO_COMPLETED;
        }
        
        return $this->save();
    }

    /**
     * Set the verification request to live video status.
     * 
     * @param int $adminId The ID of the admin setting the status
     * @return bool
     */
    public function setLiveVideo(int $adminId): bool
    {
        $this->status = self::STATUS_LIVE_VIDEO;
        $this->video_status = self::VIDEO_COMPLETED;
        $this->reviewed_by = $adminId;
        $this->reviewed_at = now();
        
        return $this->save();
    }
} 