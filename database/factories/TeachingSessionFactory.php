<?php

namespace Database\Factories;

use App\Models\TeachingSession;
use App\Models\User;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeachingSession>
 */
class TeachingSessionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TeachingSession::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('-3 months', '+1 month');
        $endTime = (clone $startTime)->modify('+60 minutes');
        $isPast = $startTime < now();
        
        // First, select a student
        $student = User::where('role', 'student')->inRandomOrder()->first();
        if (!$student) {
            $student = User::factory()->student()->create();
        }
        
        // Find a subscription for this student or create one
        $subscription = null;
        if ($student) {
            $subscription = \App\Models\Subscription::where('user_id', $student->id)
                ->where('status', 'active')
                ->first();
            
            if (!$subscription) {
                // Create a subscription with appropriate plan based on student age
                if ($student->studentProfile && $student->studentProfile->age_group === 'child') {
                    $subscription = \App\Models\Subscription::factory()
                        ->forChild()
                        ->forUser($student)
                        ->active()
                        ->create();
                } else {
                    $subscription = \App\Models\Subscription::factory()
                        ->forUser($student)
                        ->active()
                        ->create();
                }
            }
        }
        
        // Get the subscription plan
        $subscriptionPlan = $subscription ? $subscription->plan : SubscriptionPlan::inRandomOrder()->first();
        
        // Find an appropriate teacher
        $teacher = User::where('role', 'teacher')->inRandomOrder()->first();
        if (!$teacher) {
            $teacher = User::factory()->teacher()->create();
        }
        
        // Get subject based on plan
        $subject = $this->getSubjectFromPlan($subscriptionPlan);
        
        return [
            'teacher_id' => $teacher->id,
            'student_id' => $student->id,
            'guardian_id' => function (array $attributes) {
                $student = User::find($attributes['student_id']);
                if ($student && $student->studentProfile && $student->studentProfile->guardian_id) {
                    return $student->studentProfile->guardian_id;
                }
                return null;
            },
            'subscription_plan_id' => $subscriptionPlan ? $subscriptionPlan->id : null,
            'scheduled_start_time' => $startTime,
            'scheduled_end_time' => $endTime,
            'actual_start_time' => $isPast ? $startTime : null,
            'actual_end_time' => $isPast ? $endTime : null,
            'duration_minutes' => 60,
            'subject' => $subject,
            'session_topic' => function (array $attributes) use ($subscriptionPlan) {
                return $this->generateSessionTopic($attributes['subject'], $subscriptionPlan);
            },
            'session_objectives' => $this->faker->paragraph(1),
            'teaching_method' => $this->faker->randomElement(['Online', 'Direct Recitation', 'Interactive', 'Visual']),
            'status' => function (array $attributes) {
                $startTime = $attributes['scheduled_start_time'];
                if ($startTime < now()) {
                    return $this->faker->randomElement([
                        'completed',
                        'cancelled_by_teacher',
                        'cancelled_by_student',
                        'no_show'
                    ]);
                } else {
                    return $this->faker->randomElement([
                        'scheduled',
                        'confirmed'
                    ]);
                }
            },
            'teacher_notes' => function (array $attributes) {
                if ($attributes['status'] === 'completed') {
                    return $this->faker->paragraph(2);
                }
                return null;
            },
            'student_notes' => function (array $attributes) {
                if ($attributes['status'] === 'completed') {
                    return $this->faker->randomElement([null, $this->faker->sentence()]);
                }
                return null;
            },
            'meeting_link' => function (array $attributes) {
                if (in_array($attributes['status'], ['scheduled', 'confirmed'])) {
                    return $this->faker->url();
                }
                return null;
            },
            'recording_link' => function (array $attributes) {
                if ($attributes['status'] === 'completed') {
                    return $this->faker->randomElement([null, $this->faker->url()]);
                }
                return null;
            },
        ];
    }

    /**
     * Configure the model to be a completed session.
     */
    public function completed(): self
    {
        return $this->state(function (array $attributes) {
            $startTime = Carbon::parse($attributes['scheduled_start_time']);
            $endTime = Carbon::parse($attributes['scheduled_end_time']);
            
            if ($startTime > now()) {
                $startTime = now()->subDays(rand(1, 30));
                $endTime = (clone $startTime)->addHour();
            }
            
            return [
                'status' => 'completed',
                'actual_start_time' => $startTime,
                'actual_end_time' => $endTime,
                'teacher_notes' => $this->faker->paragraph(),
            ];
        });
    }

    /**
     * Configure the model to be an upcoming session.
     */
    public function upcoming(): self
    {
        return $this->state(function (array $attributes) {
            $startTime = now()->addDays(rand(1, 14))->setHour(rand(8, 18));
            $endTime = (clone $startTime)->addHour();
            
            return [
                'status' => $this->faker->randomElement(['scheduled', 'confirmed']),
                'scheduled_start_time' => $startTime,
                'scheduled_end_time' => $endTime,
                'actual_start_time' => null,
                'actual_end_time' => null,
            ];
        });
    }

    /**
     * Configure the model to be a cancelled session.
     */
    public function cancelled(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => $this->faker->randomElement([
                    'cancelled_by_teacher',
                    'cancelled_by_student',
                    'cancelled_by_guardian',
                    'cancelled_by_admin'
                ]),
            ];
        });
    }

    /**
     * Get the appropriate subject based on the subscription plan
     */
    private function getSubjectFromPlan($plan): string
    {
        if (!$plan) {
            return $this->faker->randomElement([
                'Quran Memorization',
                'Tajweed',
                'Islamic Studies'
            ]);
        }
        
        $planName = strtolower($plan->name);
        
        if (strpos($planName, 'juz') !== false || 
            strpos($planName, 'amma') !== false || 
            strpos($planName, 'quran') !== false) {
            return 'Quran Memorization';
        }
        
        if (strpos($planName, 'tajweed') !== false) {
            return 'Tajweed';
        }
        
        if (strpos($planName, 'arabic') !== false) {
            return 'Quranic Arabic';
        }
        
        if (strpos($planName, 'islamic') !== false || 
            strpos($planName, 'studies') !== false) {
            return 'Islamic Studies';
        }
        
        return $this->faker->randomElement([
            'Quran Memorization',
            'Tajweed',
            'Islamic Studies'
        ]);
    }
    
    /**
     * Generate an appropriate session topic based on subject and plan
     */
    private function generateSessionTopic(string $subject, $plan): string
    {
        if ($subject === 'Quran Memorization') {
            $planName = $plan ? strtolower($plan->name) : '';
            
            if (strpos($planName, 'juz') !== false || strpos($planName, 'amma') !== false) {
                $surah = $this->faker->randomElement([
                    'An-Naba', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar', 
                    'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A\'la'
                ]);
                return "$surah - Verses " . rand(1, 10) . "-" . rand(11, 20);
            } elseif (strpos($planName, 'half') !== false) {
                $surah = $this->faker->randomElement([
                    'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah', 'Al-An\'am',
                    'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf'
                ]);
                $start = rand(1, 30);
                $end = $start + rand(5, 15);
                return "$surah - Verses $start-$end";
            } elseif (strpos($planName, 'full') !== false) {
                $surah = $this->faker->randomElement([
                    'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah', 'Al-An\'am',
                    'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus', 'Hud', 'Yusuf',
                    'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr', 'An-Nahl', 'Al-Isra'
                ]);
                $start = rand(1, 50);
                $end = $start + rand(5, 20);
                return "$surah - Verses $start-$end";
            } else {
                $surah = $this->faker->randomElement([
                    'Al-Fatihah', 'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Maidah'
                ]);
                $start = $this->faker->numberBetween(1, 20);
                $end = $start + $this->faker->numberBetween(3, 10);
                return "$surah - Verses $start-$end";
            }
        } elseif ($subject === 'Tajweed') {
            return $this->faker->randomElement([
                'Rules of Noon Saakinah and Tanween',
                'Rules of Meem Saakinah',
                'Rules of Elongation (Madd)',
                'Rules of Qalqalah',
                'Heavy and Light Letters',
                'Rules of Stopping (Waqf)',
                'Pronunciation of Arabic Letters'
            ]);
        } elseif ($subject === 'Islamic Studies') {
            return $this->faker->randomElement([
                'Introduction to Tawheed',
                'Pillars of Islam',
                'Prophets in Islam',
                'Life of Prophet Muhammad (PBUH)',
                'Islamic Ethics and Morals',
                'Introduction to Fiqh',
                'Islamic History: Rightly Guided Caliphs'
            ]);
        } elseif ($subject === 'Quranic Arabic') {
            return $this->faker->randomElement([
                'Arabic Alphabet and Pronunciation',
                'Basic Arabic Grammar',
                'Common Quranic Vocabulary',
                'Understanding Simple Quranic Verses',
                'Arabic Sentence Structure',
                'Word Patterns in the Quran',
                'Translation Exercise: Simple Surahs'
            ]);
        }
        
        return $this->faker->sentence(4);
    }
} 