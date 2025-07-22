<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherProfile>
 */
class TeacherProfileFactory extends Factory
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
        $selectedSubjects = $this->faker->randomElements($allSubjects, $this->faker->numberBetween(1, 5));

        $specializationOptions = ['Quran Memorization', 'Tajweed Expert', 'Arabic Language', 'Islamic Studies', 'Children\'s Education'];
        
        $teachingTypes = ['Online', 'In-person', 'Both'];
        $teachingModes = ['Full-time', 'Part-time'];
        
        $languages = ['English', 'Arabic', 'Urdu', 'French', 'Turkish', 'Malay', 'Indonesian', 'Hindi', 'Bengali', 'Somali'];
        $selectedLanguages = $this->faker->randomElements($languages, $this->faker->numberBetween(1, 3));
        
        // Generate availability schedule
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $timeSlots = [
            '08:00-10:00',
            '10:00-12:00',
            '13:00-15:00',
            '15:00-17:00',
            '18:00-20:00',
            '20:00-22:00'
        ];
        
        $schedule = [];
        $activeDays = $this->faker->randomElements($days, $this->faker->numberBetween(3, 6));
        
        foreach ($days as $day) {
            if (in_array($day, $activeDays)) {
                $slotCount = $this->faker->numberBetween(1, 3);
                $schedule[$day] = $this->faker->randomElements($timeSlots, $slotCount);
            } else {
                $schedule[$day] = [];
            }
        }

        return [
            'user_id' => User::factory()->teacher(),
            'bio' => $this->faker->paragraphs(2, true),
            'years_of_experience' => $this->faker->numberBetween(1, 20),
            'teaching_subjects' => $selectedSubjects,
            'specialization' => $this->faker->randomElement($specializationOptions),
            'teaching_type' => $this->faker->randomElement($teachingTypes),
            'teaching_mode' => $this->faker->randomElement($teachingModes),
            'teaching_languages' => $selectedLanguages,
            'availability_schedule' => $schedule,
            'overall_rating' => $this->faker->randomFloat(1, 3.5, 5.0),
            'total_reviews' => $this->faker->numberBetween(0, 50),
            'total_sessions_taught' => $this->faker->numberBetween(0, 1000),
            'is_verified' => $this->faker->boolean(80), // 80% chance of being verified
            'last_active_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Configure the teacher as highly experienced.
     */
    public function experienced(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => $this->faker->numberBetween(10, 30),
            'overall_rating' => $this->faker->randomFloat(1, 4.5, 5.0),
            'total_sessions_taught' => $this->faker->numberBetween(500, 2000),
            'is_verified' => true,
        ]);
    }

    /**
     * Configure the teacher as new.
     */
    public function newTeacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => $this->faker->numberBetween(0, 2),
            'total_reviews' => $this->faker->numberBetween(0, 10),
            'total_sessions_taught' => $this->faker->numberBetween(0, 50),
        ]);
    }

    /**
     * Configure the teacher as a Quran specialist.
     */
    public function quranSpecialist(): static
    {
        $quranSubjects = ['Tajweed', 'Hifz', 'Qira\'ah', 'Tafsir'];
        $selectedSubjects = $this->faker->randomElements($quranSubjects, $this->faker->numberBetween(2, 4));

        return $this->state(fn (array $attributes) => [
            'teaching_subjects' => $selectedSubjects,
            'specialization' => $this->faker->randomElement(['Quran Memorization', 'Tajweed Expert']),
            'teaching_languages' => ['Arabic', 'English'],
        ]);
    }
}
