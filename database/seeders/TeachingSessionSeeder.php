<?php

namespace Database\Seeders;

use App\Models\TeachingSession;
use App\Models\User;
use App\Models\Rating;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TeachingSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo sessions for the demo user
        $this->createDemoSessions();
        
        // Create realistic sessions for all other students based on their subscriptions
        $this->createRealisticSessions();
    }

    /**
     * Create demo teaching sessions between the demo teacher and student.
     */
    private function createDemoSessions(): void
    {
        // Get demo users
        $demoTeacher = User::where('email', 'teacher@sch.com')->first();
        $demoStudent = User::where('email', 'student@sch.com')->first();
        $demoGuardian = User::where('email', 'guardian@sch.com')->first();
        
        if (!$demoTeacher || !$demoStudent) {
            return;
        }
        
        // Get a subscription plan for this student
        $subscription = Subscription::where('user_id', $demoStudent->id)
            ->where('status', 'active')
            ->latest()
            ->first();
        
        $subscriptionPlanId = $subscription ? $subscription->subscription_plan_id : null;

        // Create completed sessions in the past
        for ($i = 1; $i <= 5; $i++) {
            $startTime = now()->subDays($i * 7)->setHour(10)->setMinute(0);
            $endTime = now()->subDays($i * 7)->setHour(11)->setMinute(0);

            $session = TeachingSession::create([
                'teacher_id' => $demoTeacher->id,
                'student_id' => $demoStudent->id,
                'guardian_id' => $demoGuardian ? $demoGuardian->id : null,
                'subscription_plan_id' => $subscriptionPlanId,
                'scheduled_start_time' => $startTime,
                'scheduled_end_time' => $endTime,
                'actual_start_time' => $startTime,
                'actual_end_time' => $endTime,
                'duration_minutes' => 60,
                'subject' => 'Quran Memorization',
                'session_topic' => 'Surah Al-Baqarah - Verses ' . ($i * 5) . '-' . ($i * 5 + 4),
                'status' => 'completed',
                'teacher_notes' => 'Student showed good progress in memorization. Need to work on tajweed rules.',
            ]);

            // Add ratings for the completed session
            Rating::create([
                'rater_id' => $demoStudent->id,
                'ratee_id' => $demoTeacher->id,
                'teaching_session_id' => $session->id,
                'category' => 'overall',
                'rating_value' => rand(40, 50) / 10,
                'review_text' => 'Great teaching style and very patient.',
            ]);

            Rating::create([
                'rater_id' => $demoTeacher->id,
                'ratee_id' => $demoStudent->id,
                'teaching_session_id' => $session->id,
                'category' => 'learning_progress',
                'rating_value' => rand(35, 50) / 10,
                'review_text' => 'Good progress but needs more practice.',
            ]);
        }

        // Create upcoming sessions
        for ($i = 1; $i <= 3; $i++) {
            TeachingSession::create([
                'teacher_id' => $demoTeacher->id,
                'student_id' => $demoStudent->id,
                'guardian_id' => $demoGuardian ? $demoGuardian->id : null,
                'subscription_plan_id' => $subscriptionPlanId,
                'scheduled_start_time' => now()->addDays($i * 2)->setHour(10)->setMinute(0),
                'scheduled_end_time' => now()->addDays($i * 2)->setHour(11)->setMinute(0),
                'subject' => 'Quran Memorization',
                'session_topic' => 'Surah Al-Baqarah - ' . ($i === 1 ? 'Review previous lessons' : 'New lesson'),
                'status' => 'scheduled',
                'meeting_link' => 'https://meet.google.com/' . strtolower(fake()->bothify('????####')),
            ]);
        }
    }

    /**
     * Create realistic sessions for all students based on their subscriptions.
     */
    private function createRealisticSessions(): void
    {
        // Get all active subscriptions
        $activeSubscriptions = Subscription::where('status', 'active')->get();
        
        foreach ($activeSubscriptions as $subscription) {
            // Skip demo student (already handled)
            if ($subscription->user->email === 'student@sch.com') {
                continue;
            }
            
            $student = $subscription->user;
            $plan = $subscription->plan;
            
            if (!$student || !$plan) {
                continue;
            }
            
            // Determine guardian if exists
            $guardianId = null;
            if ($student->studentProfile && $student->studentProfile->guardian_id) {
                $guardianId = $student->studentProfile->guardian_id;
            }
            
            // Determine how many past sessions to create
            // More expensive plans should have more sessions
            $sessionsPerMonth = match(true) {
                $plan->price >= 20000 => rand(12, 16), // 3-4 per week
                $plan->price >= 10000 => rand(8, 12),  // 2-3 per week
                default => rand(4, 8),                 // 1-2 per week
            };
            
            // Calculate how many months since subscription started
            $monthsSinceStart = Carbon::parse($subscription->start_date)->diffInMonths(now()) + 1;
            $totalPastSessions = min($monthsSinceStart * $sessionsPerMonth, 50); // Cap at 50 sessions
            
            // Assign a teacher for this student's sessions
            $teacher = User::where('role', 'teacher')->inRandomOrder()->first();
            
            // Create past sessions
            $this->createPastSessionsForStudent($student, $teacher, $guardianId, $plan->id, $totalPastSessions);
            
            // Create upcoming sessions
            $upcomingSessions = rand(1, 4); // 1-4 upcoming sessions
            $this->createUpcomingSessionsForStudent($student, $teacher, $guardianId, $plan->id, $upcomingSessions);
        }
    }
    
    /**
     * Create past sessions for a student
     */
    private function createPastSessionsForStudent($student, $teacher, $guardianId, $planId, $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            // More recent sessions are more likely to be completed successfully
            $recentSession = $i < ($count / 3);
            $status = $recentSession 
                ? (fake()->randomElement(['completed', 'completed', 'completed', 'no_show'])) 
                : (fake()->randomElement(['completed', 'cancelled_by_student', 'cancelled_by_teacher', 'no_show']));
                
            // Set session date and time
            $startTime = now()->subDays(($count - $i) * 3 + rand(0, 3))->setHour(rand(9, 20))->setMinute(0);
            $endTime = (clone $startTime)->addMinutes(60);
            
            // Create session
            $session = TeachingSession::create([
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'guardian_id' => $guardianId,
                'subscription_plan_id' => $planId,
                'scheduled_start_time' => $startTime,
                'scheduled_end_time' => $endTime,
                'actual_start_time' => $status === 'completed' ? $startTime : null,
                'actual_end_time' => $status === 'completed' ? $endTime : null,
                'duration_minutes' => 60,
                'subject' => $this->getSubjectFromPlan($planId),
                'session_topic' => $this->generateSessionTopic($planId),
                'status' => $status,
                'teacher_notes' => $status === 'completed' ? fake()->paragraph() : null,
            ]);
            
            // Add ratings for completed sessions (but not all)
            if ($status === 'completed' && rand(0, 100) < 70) {
                Rating::create([
                    'rater_id' => $student->id,
                    'ratee_id' => $teacher->id,
                    'teaching_session_id' => $session->id,
                    'category' => 'overall',
                    'rating_value' => rand(30, 50) / 10, // 3.0 - 5.0
                    'review_text' => rand(0, 100) < 50 ? fake()->sentence(rand(5, 15)) : null,
                ]);
                
                if (rand(0, 100) < 60) {
                    Rating::create([
                        'rater_id' => $teacher->id,
                        'ratee_id' => $student->id,
                        'teaching_session_id' => $session->id,
                        'category' => 'learning_progress',
                        'rating_value' => rand(30, 50) / 10, // 3.0 - 5.0
                        'review_text' => rand(0, 100) < 80 ? fake()->sentence(rand(5, 20)) : null,
                    ]);
                }
            }
        }
    }
    
    /**
     * Create upcoming sessions for a student
     */
    private function createUpcomingSessionsForStudent($student, $teacher, $guardianId, $planId, $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Set session date and time
            $startTime = now()->addDays($i * 2 + rand(1, 3))->setHour(rand(9, 20))->setMinute(0);
            $endTime = (clone $startTime)->addMinutes(60);
            
            // Create session
            TeachingSession::create([
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'guardian_id' => $guardianId,
                'subscription_plan_id' => $planId,
                'scheduled_start_time' => $startTime,
                'scheduled_end_time' => $endTime,
                'duration_minutes' => 60,
                'subject' => $this->getSubjectFromPlan($planId),
                'session_topic' => $this->generateSessionTopic($planId),
                'status' => rand(0, 100) < 70 ? 'scheduled' : 'confirmed',
                'meeting_link' => 'https://meet.google.com/' . strtolower(fake()->bothify('????####')),
            ]);
        }
    }
    
    /**
     * Generate a session topic based on the subscription plan
     */
    private function generateSessionTopic($planId): string
    {
        $plan = SubscriptionPlan::find($planId);
        
        if (!$plan) {
            return fake()->sentence(4);
        }
        
        if (stripos($plan->name, 'juz') !== false || stripos($plan->name, 'amma') !== false) {
            $surah = fake()->randomElement([
                'An-Naba', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar', 
                'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A\'la'
            ]);
            return "$surah - Verses " . rand(1, 10) . "-" . rand(11, 20);
        }
        
        if (stripos($plan->name, 'tajweed') !== false) {
            return fake()->randomElement([
                'Rules of Noon Saakinah and Tanween',
                'Rules of Meem Saakinah',
                'Rules of Elongation (Madd)',
                'Rules of Qalqalah',
                'Heavy and Light Letters',
                'Rules of Stopping (Waqf)',
                'Pronunciation of Arabic Letters'
            ]);
        }
        
        if (stripos($plan->name, 'half') !== false) {
            $surah = fake()->randomElement([
                'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah', 'Al-An\'am',
                'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf'
            ]);
            $start = rand(1, 30);
            $end = $start + rand(5, 15);
            return "$surah - Verses $start-$end";
        }
        
        if (stripos($plan->name, 'full') !== false) {
            $surah = fake()->randomElement([
                'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah', 'Al-An\'am',
                'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf',
                'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra'
            ]);
            $start = rand(1, 50);
            $end = $start + rand(5, 20);
            return "$surah - Verses $start-$end";
        }
        
        return fake()->sentence(4);
    }
    
    /**
     * Get a subject from the subscription plan
     */
    private function getSubjectFromPlan($planId): string
    {
        $plan = SubscriptionPlan::find($planId);
        
        if (!$plan) {
            return fake()->randomElement([
                'Quran Memorization',
                'Tajweed',
                'Islamic Studies'
            ]);
        }
        
        if (stripos($plan->name, 'juz') !== false || stripos($plan->name, 'amma') !== false ||
            stripos($plan->name, 'half') !== false || stripos($plan->name, 'full') !== false) {
            return 'Quran Memorization';
        }
        
        if (stripos($plan->name, 'tajweed') !== false) {
            return 'Tajweed';
        }
        
        return fake()->randomElement([
            'Quran Memorization',
            'Tajweed',
            'Islamic Studies'
        ]);
    }
} 