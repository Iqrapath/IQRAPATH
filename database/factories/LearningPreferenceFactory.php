<?php

namespace Database\Factories;

use App\Models\LearningPreference;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class LearningPreferenceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = LearningPreference::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            'Quran Reading',
            'Quran Memorization',
            'Tajweed Rules',
            'Tafsir (Interpretation)',
            'Arabic Language',
            'Islamic Studies',
            'Fiqh (Jurisprudence)',
            'Aqeedah (Beliefs)',
            'Hadith Studies',
            'Seerah (Prophetic Biography)'
        ];

        $ageGroups = [
            '4-6 Years',
            '7-9 Years',
            '10-12 Years',
            '13-15 Years',
            '16-18 Years',
            'Adults'
        ];

        // Generate 2-4 random subjects
        $preferredSubjects = fake()->randomElements(
            $subjects,
            fake()->numberBetween(2, 4)
        );

        // Generate preferred learning times
        $learningTimes = [];
        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        foreach ($daysOfWeek as $day) {
            // 70% chance that a day is selected
            $isSelected = fake()->boolean(70);

            if ($isSelected) {
                // Generate random time slots
                $startHour = fake()->numberBetween(8, 18);
                $endHour = $startHour + fake()->numberBetween(1, 3);

                $learningTimes[] = [
                    'day' => $day,
                    'fromTime' => sprintf('%02d:00', $startHour),
                    'toTime' => sprintf('%02d:00', $endHour),
                    'isSelected' => true
                ];
            } else {
                $learningTimes[] = [
                    'day' => $day,
                    'fromTime' => '',
                    'toTime' => '',
                    'isSelected' => false
                ];
            }
        }
        
        // Create a student if needed
        $student = User::factory()->student()->create();

        return [
            'user_id' => $student->id,
            'preferred_subjects' => $preferredSubjects,
            'teaching_mode' => fake()->randomElement(['full-time', 'part-time']),
            'student_age_group' => fake()->randomElement($ageGroups),
            'preferred_learning_times' => $learningTimes,
            'additional_notes' => fake()->boolean(70) ? fake()->paragraph(2) : null,
        ];
    }

    /**
     * Configure for a specific user
     */
    public function forUser(User $user): static
    {
        return $this->state(function (array $attributes) use ($user) {
            // Get the student profile if it exists
            $studentProfile = StudentProfile::where('user_id', $user->id)->first();
            
            // Determine age group based on student profile
            $ageGroup = 'Adults'; // Default
            if ($studentProfile) {
                if ($studentProfile->age_group === 'child') {
                    $ageGroup = fake()->randomElement(['4-6 Years', '7-9 Years', '10-12 Years']);
                } elseif ($studentProfile->age_group === 'teenager') {
                    $ageGroup = fake()->randomElement(['13-15 Years', '16-18 Years']);
                }
            }
            
            // Get the student's subscription to align subjects
            $subscription = \App\Models\Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();
            
            $preferredSubjects = [];
            if ($subscription && $subscription->plan) {
                $planName = strtolower($subscription->plan->name);
                
                if (strpos($planName, 'quran') !== false) {
                    $preferredSubjects[] = 'Quran Memorization';
                    $preferredSubjects[] = 'Quran Reading';
                }
                
                if (strpos($planName, 'tajweed') !== false) {
                    $preferredSubjects[] = 'Tajweed Rules';
                }
                
                if (strpos($planName, 'arabic') !== false) {
                    $preferredSubjects[] = 'Arabic Language';
                }
                
                if (strpos($planName, 'islamic') !== false || strpos($planName, 'studies') !== false) {
                    $preferredSubjects[] = 'Islamic Studies';
                    $preferredSubjects[] = 'Fiqh (Jurisprudence)';
                }
            }
            
            // If no subjects were determined from subscription, use random ones
            if (empty($preferredSubjects)) {
                $allSubjects = [
                    'Quran Reading',
                    'Quran Memorization',
                    'Tajweed Rules',
                    'Tafsir (Interpretation)',
                    'Arabic Language',
                    'Islamic Studies',
                    'Fiqh (Jurisprudence)',
                    'Aqeedah (Beliefs)',
                    'Hadith Studies',
                    'Seerah (Prophetic Biography)'
                ];
                
                $preferredSubjects = fake()->randomElements(
                    $allSubjects,
                    fake()->numberBetween(2, 4)
                );
            }
            
            return [
                'user_id' => $user->id,
                'student_age_group' => $ageGroup,
                'preferred_subjects' => $preferredSubjects,
            ];
        });
    }

    /**
     * Configure for younger children
     */
    public function forChild(): static
    {
        return $this->state(function (array $attributes) {
            $childSubjects = [
                'Quran Reading',
                'Quran Memorization',
                'Tajweed Rules',
                'Arabic Alphabet',
                'Basic Islamic Studies'
            ];
            
            return [
                'student_age_group' => fake()->randomElement(['4-6 Years', '7-9 Years']),
                'teaching_mode' => 'part-time',
                'preferred_subjects' => fake()->randomElements($childSubjects, fake()->numberBetween(2, 3)),
                'additional_notes' => 'Child needs patient teacher. Prefers visual learning aids.',
            ];
        });
    }

    /**
     * Configure for teenagers
     */
    public function forTeenager(): static
    {
        return $this->state(function (array $attributes) {
            $teenSubjects = [
                'Quran Memorization',
                'Tajweed Rules',
                'Tafsir (Interpretation)',
                'Arabic Language',
                'Islamic Studies',
                'Fiqh (Jurisprudence)'
            ];
            
            return [
                'student_age_group' => fake()->randomElement(['10-12 Years', '13-15 Years', '16-18 Years']),
                'teaching_mode' => 'full-time',
                'preferred_subjects' => fake()->randomElements($teenSubjects, fake()->numberBetween(2, 4)),
            ];
        });
    }

    /**
     * Configure for adults
     */
    public function forAdult(): static
    {
        return $this->state(function (array $attributes) {
            $adultSubjects = [
                'Quran Memorization',
                'Tajweed Rules',
                'Tafsir (Interpretation)',
                'Arabic Language',
                'Islamic Studies',
                'Fiqh (Jurisprudence)',
                'Hadith Studies',
                'Seerah (Prophetic Biography)'
            ];
            
            return [
                'student_age_group' => 'Adults',
                'teaching_mode' => fake()->randomElement(['full-time', 'part-time']),
                'preferred_subjects' => fake()->randomElements($adultSubjects, fake()->numberBetween(2, 4)),
                'additional_notes' => 'Working professional seeking to improve Quranic knowledge. Prefers evening sessions.',
            ];
        });
    }
}
