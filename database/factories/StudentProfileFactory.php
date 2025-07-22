<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentProfile>
 */
class StudentProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quranSubjects = ['Tajweed', 'Hifz', 'Qira\'ah', 'Tafsir'];
        $islamicSubjects = ['Fiqh', 'Aqeedah', 'Seerah', 'Arabic Language', 'Islamic History'];

        $allSubjects = array_merge($quranSubjects, $islamicSubjects);
        $selectedSubjects = $this->faker->randomElements($allSubjects, $this->faker->numberBetween(1, 3));

        $schools = [
            'Al-Huda Islamic School',
            'Iqra Academy',
            'Dar al-Arqam',
            'Al-Falah Academy',
            'Al-Rahmah School',
            'Peace Academy',
            'New Horizon School',
            'Tarbiyah School',
            'Homeschooled'
        ];

        $learningMethods = ['One-on-one', 'Small Group', 'Self-paced', 'Interactive', 'Practical Application'];
        $learningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Multimodal'];

        // Age ranges for different education levels
        $ageRanges = [
            'Elementary' => ['min' => 5, 'max' => 11],
            'Middle School' => ['min' => 11, 'max' => 14],
            'High School' => ['min' => 14, 'max' => 18],
            'College' => ['min' => 18, 'max' => 25],
            'Adult Learner' => ['min' => 25, 'max' => 70],
        ];

        $educationLevel = $this->faker->randomElement(array_keys($ageRanges));
        $ageRange = $ageRanges[$educationLevel];

        // Generate birth date based on education level
        $birthDate = $this->faker->dateTimeBetween(
            '-' . $ageRange['max'] . ' years',
            '-' . $ageRange['min'] . ' years'
        );

        // Determine age group
        $age = $birthDate->diff(now())->y;
        $ageGroup = $age < 13 ? 'child' : ($age < 18 ? 'teenager' : 'adult');

        // Generate grade level based on education level
        $gradeLevelMap = [
            'Elementary' => ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
            'Middle School' => ['6th Grade', '7th Grade', '8th Grade'],
            'High School' => ['9th Grade', '10th Grade', '11th Grade', '12th Grade'],
            'College' => ['Freshman', 'Sophomore', 'Junior', 'Senior'],
            'Adult Learner' => ['Beginner', 'Intermediate', 'Advanced'],
        ];

        $gradeLevel = $this->faker->randomElement($gradeLevelMap[$educationLevel]);
        
        // Set guardian only for non-adults
        $guardianId = null;
        if ($ageGroup !== 'adult') {
            // Try to get an existing guardian
            $guardian = User::where('role', 'guardian')->inRandomOrder()->first();
            
            // If no guardian exists, create one
            if (!$guardian) {
                $guardian = User::factory()->guardian()->create();
                \App\Models\GuardianProfile::factory()->create([
                    'user_id' => $guardian->id
                ]);
            }
            
            $guardianId = $guardian->id;
        }

        return [
            'user_id' => User::factory()->student(),
            'date_of_birth' => $birthDate,
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'education_level' => $educationLevel,
            'age_group' => $ageGroup,
            'school_name' => $this->faker->randomElement($schools),
            'grade_level' => $gradeLevel,
            'subjects_of_interest' => $selectedSubjects,
            'learning_goals' => $this->faker->paragraph(),
            'learning_difficulties' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'learning_style' => $this->faker->randomElement($learningStyles),
            'guardian_id' => $guardianId,
            'preferred_learning_method' => $this->faker->randomElement($learningMethods),
            'preferred_teacher_gender' => $this->faker->randomElement(['Male', 'Female', 'No Preference']),
            'total_sessions_attended' => $this->faker->numberBetween(0, 50),
            'attendance_rate' => $this->faker->randomFloat(2, 70, 100),
            'last_session_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-3 months', 'now') : null,
            'teacher_feedback' => $this->faker->boolean(60) ? $this->faker->paragraph() : null,
            'medical_information' => $this->faker->boolean(20) ? $this->faker->sentence() : null,
            'emergency_contact' => $this->faker->phoneNumber(),
            'emergency_contact_relationship' => $this->faker->randomElement(['Parent', 'Guardian', 'Sibling', 'Relative']),
        ];
    }

    /**
     * Configure the student as a child.
     */
    public function child(): static
    {
        return $this->state(function (array $attributes) {
            $birthDate = $this->faker->dateTimeBetween('-12 years', '-5 years');
            $gradeLevel = $this->faker->randomElement(['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade']);
            
            // Get a guardian
            $guardian = User::where('role', 'guardian')->inRandomOrder()->first();
            if (!$guardian) {
                $guardian = User::factory()->guardian()->create();
                \App\Models\GuardianProfile::factory()->create([
                    'user_id' => $guardian->id
                ]);
            }

            return [
                'date_of_birth' => $birthDate,
                'education_level' => 'Elementary',
                'grade_level' => $gradeLevel,
                'age_group' => 'child',
                'guardian_id' => $guardian->id,
            ];
        });
    }

    /**
     * Configure the student as a teenager.
     */
    public function teenager(): static
    {
        return $this->state(function (array $attributes) {
            $birthDate = $this->faker->dateTimeBetween('-18 years', '-13 years');
            $isHighSchool = $this->faker->boolean(70);

            if ($isHighSchool) {
                $educationLevel = 'High School';
                $gradeLevel = $this->faker->randomElement(['9th Grade', '10th Grade', '11th Grade', '12th Grade']);
            } else {
                $educationLevel = 'Middle School';
                $gradeLevel = $this->faker->randomElement(['6th Grade', '7th Grade', '8th Grade']);
            }
            
            // Get a guardian
            $guardian = User::where('role', 'guardian')->inRandomOrder()->first();
            if (!$guardian) {
                $guardian = User::factory()->guardian()->create();
                \App\Models\GuardianProfile::factory()->create([
                    'user_id' => $guardian->id
                ]);
            }

            return [
                'date_of_birth' => $birthDate,
                'education_level' => $educationLevel,
                'grade_level' => $gradeLevel,
                'age_group' => 'teenager',
                'guardian_id' => $guardian->id,
            ];
        });
    }

    /**
     * Configure the student as an adult learner.
     */
    public function adultLearner(): static
    {
        return $this->state(function (array $attributes) {
            $birthDate = $this->faker->dateTimeBetween('-70 years', '-18 years');

            return [
                'date_of_birth' => $birthDate,
                'education_level' => 'Adult Learner',
                'grade_level' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced']),
                'school_name' => null,
                'guardian_id' => null, // Adults don't have guardians
                'age_group' => 'adult',
            ];
        });
    }
}
