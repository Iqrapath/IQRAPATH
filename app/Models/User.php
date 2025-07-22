<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'phone_number',
        'location',
        'status',
        'registration_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
            'status' => 'string',
            'registration_date' => 'date',
        ];
    }

    /**
     * Get the redirect route based on user role.
     *
     * @return string
     */
    public function getRedirectRoute(): string
    {
        return match($this->role) {
            'admin' => 'admin.dashboard',
            'teacher' => 'teacher.dashboard',
            'student' => 'student.dashboard',
            'guardian' => 'guardian.dashboard',
            default => 'dashboard',
        };
    }

    /**
     * Get the learning preferences for the user.
     */
    public function learningPreference(): HasOne
    {
        return $this->hasOne(LearningPreference::class);
    }

    /**
     * Check if the user has learning preferences set.
     *
     * @return bool
     */
    public function hasLearningPreferences(): bool
    {
        return $this->learningPreference()->exists();
    }

    /**
     * Get the subscriptions for the user.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the subscription payments for the user.
     */
    public function subscriptionPayments(): HasMany
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    /**
     * Get the teacher profile associated with the user.
     */
    public function teacherProfile(): HasOne
    {
        return $this->hasOne(TeacherProfile::class);
    }

    /**
     * Get the student profile associated with the user.
     */
    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * Get the guardian profile associated with the user.
     */
    public function guardianProfile(): HasOne
    {
        return $this->hasOne(GuardianProfile::class);
    }

    /**
     * Get the students associated with this guardian.
     */
    public function guardianStudents(): HasMany
    {
        return $this->hasMany(StudentProfile::class, 'guardian_id');
    }

    /**
     * Get the documents uploaded by the user.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DocumentUpload::class);
    }

    /**
     * Get the schedules for the user.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the teaching sessions where the user is the teacher.
     */
    public function teachingSessions(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'teacher_id');
    }

    /**
     * Get the teaching sessions where the user is the student.
     */
    public function learningSession(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'student_id');
    }

    /**
     * Get the teaching sessions where the user is the guardian.
     */
    public function guardianSessions(): HasMany
    {
        return $this->hasMany(TeachingSession::class, 'guardian_id');
    }

    /**
     * Get the ratings given by the user.
     */
    public function ratingsGiven(): HasMany
    {
        return $this->hasMany(Rating::class, 'rater_id');
    }

    /**
     * Get the ratings received by the user.
     */
    public function ratingsReceived(): HasMany
    {
        return $this->hasMany(Rating::class, 'ratee_id');
    }

    /**
     * Get the performance stats for the user.
     */
    public function performanceStats(): HasMany
    {
        return $this->hasMany(PerformanceStat::class);
    }

    /**
     * Get the wallet for the teacher.
     */
    public function teacherWallet(): HasOne
    {
        return $this->hasOne(TeacherWallet::class);
    }

    /**
     * Get the earnings for the teacher.
     */
    public function earnings(): HasMany
    {
        return $this->hasMany(Earning::class);
    }

    /**
     * Get the payout requests for the teacher.
     */
    public function payoutRequests(): HasMany
    {
        return $this->hasMany(PayoutRequest::class);
    }

    /**
     * Get the wallet transactions for the teacher through their wallet.
     */
    public function walletTransactions()
    {
        return $this->hasManyThrough(
            WalletTransaction::class,
            TeacherWallet::class,
            'user_id', // Foreign key on TeacherWallet table
            'wallet_id', // Foreign key on WalletTransaction table
            'id', // Local key on User table
            'id' // Local key on TeacherWallet table
        );
    }

    /**
     * Get the total earnings for the teacher.
     * 
     * @return float
     */
    public function getTotalEarningsAttribute(): float
    {
        return $this->earnings()->where('status', 'paid')->sum('amount');
    }

    /**
     * Get the pending payouts for the teacher.
     * 
     * @return float
     */
    public function getPendingPayoutsAttribute(): float
    {
        return $this->payoutRequests()->where('status', 'pending')->sum('amount');
    }

    /**
     * Check if the user has a profile based on their role.
     *
     * @return bool
     */
    public function hasProfile(): bool
    {
        return match($this->role) {
            'student' => $this->studentProfile()->exists(),
            'teacher' => $this->teacherProfile()->exists(),
            'guardian' => $this->guardianProfile()->exists(),
            default => false,
        };
    }

    /**
     * Check if the guardian has registered any children.
     *
     * @return bool
     */
    public function getHasRegisteredChildrenAttribute(): bool
    {
        if ($this->role !== 'guardian') {
            return false;
        }

        return $this->guardianStudents()->count() > 0;
    }
}
