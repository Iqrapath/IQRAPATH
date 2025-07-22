<?php

namespace Database\Seeders;

use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing teacher profiles
        TeacherProfile::query()->delete(); // Use delete instead of truncate to avoid foreign key constraints

        // Create teacher users with profiles
        $teachers = User::factory()
            ->count(10)
            ->teacher()
            ->create();

        // Get available subjects or create them if none exist
        $subjects = Subject::all();
        if ($subjects->isEmpty()) {
            $this->call(SubjectSeeder::class);
            $subjects = Subject::all();
        }

        // Create teacher profiles with proper subject relationships
        foreach ($teachers as $teacher) {
            $profile = TeacherProfile::factory()->create([
                'user_id' => $teacher->id,
            ]);

            // Assign 2-4 random subjects to each teacher
            $subjectCount = rand(2, 4);
            $selectedSubjects = $subjects->random($subjectCount);
            
            // Choose a primary subject
            $primarySubject = $selectedSubjects->random();
            
            foreach ($selectedSubjects as $subject) {
                $profile->subjects()->attach($subject->id, [
                    'is_primary' => ($subject->id === $primarySubject->id),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Teacher profiles created successfully with subject relationships.');
    }
    
    /**
     * Create a teacher profile with the given attributes.
     */
    private function createTeacherProfile(User $teacher, array $attributes): TeacherProfile
    {
        return TeacherProfile::create(array_merge([
            'user_id' => $teacher->id,
        ], $attributes));
    }
    
    /**
     * Get a random bio based on teacher type.
     */
    private function getRandomBio(string $type = 'general'): string
    {
        $bios = [
            'experienced' => [
                'Experienced Islamic educator with a passion for teaching Quran and Islamic studies. Specializes in helping students develop a deep understanding of Islamic principles and practices.',
                'Dedicated teacher with over a decade of experience in Islamic education. Focuses on personalized learning experiences that cater to each student\'s unique needs and learning style.',
                'Seasoned educator with extensive experience teaching Islamic subjects. Combines traditional teaching methods with modern approaches to create engaging learning experiences.',
            ],
            'new' => [
                'Enthusiastic new teacher with a fresh perspective on Islamic education. Committed to creating a supportive and engaging learning environment for students of all ages.',
                'Recently certified Islamic studies teacher with a passion for making learning accessible and enjoyable. Specializes in beginner-friendly approaches to Quran and Arabic.',
                'Newly qualified teacher with a modern approach to Islamic education. Focuses on interactive learning experiences that make Islamic studies relevant to contemporary life.',
            ],
            'quran' => [
                'Specialized Quran teacher with expertise in tajweed and memorization techniques. Helps students develop proper recitation skills and build a strong connection with the Quran.',
                'Dedicated Quran instructor with a focus on proper pronunciation and memorization. Creates personalized learning plans to help students achieve their Quranic goals.',
                'Expert in Quranic sciences with a methodical approach to teaching tajweed and memorization. Emphasizes understanding the meaning alongside proper recitation.',
            ],
            'arabic' => [
                'Arabic language specialist with a communicative approach to teaching. Helps students develop practical language skills for real-world communication.',
                'Experienced Arabic instructor focusing on both classical and modern Arabic. Designs lessons that develop reading, writing, speaking, and listening skills.',
                'Arabic language expert specializing in teaching Arabic to non-native speakers. Uses innovative methods to make learning Arabic accessible and enjoyable.',
            ],
            'general' => [
                'Dedicated Islamic educator committed to helping students develop a strong foundation in Islamic knowledge and practice.',
                'Passionate teacher who creates a supportive learning environment where students can explore and deepen their understanding of Islam.',
                'Experienced instructor with a student-centered approach to teaching Islamic subjects.',
            ],
        ];
        
        $typeSpecificBios = $bios[$type] ?? $bios['general'];
        return $typeSpecificBios[array_rand($typeSpecificBios)];
    }
    
    /**
     * Get a random specialization.
     */
    private function getRandomSpecialization(): string
    {
        $specializations = [
            'Quran Memorization',
            'Tajweed Expert',
            'Arabic Language',
            'Islamic Studies',
            'Children\'s Education',
            'Fiqh',
            'Hadith Studies',
            'Tafsir',
            'Islamic History',
            'Arabic Grammar',
        ];
        
        return $specializations[array_rand($specializations)];
    }

    /**
     * Get a faker instance.
     */
    private function faker()
    {
        return \Faker\Factory::create();
    }

    /**
     * Get random teaching subjects.
     */
    private function getRandomSubjects($count = null)
    {
        $subjects = [
            'Tajweed',
            'Hifz',
            'Qira\'ah',
            'Arabic',
            'Tafsir',
            'Hadith',
            'Fiqh',
            'Aqeedah',
            'Seerah',
            'Grammar',
            'Conversation',
        ];

        if ($count === null) {
            $count = rand(2, 5);
        }

        shuffle($subjects);
        return array_slice($subjects, 0, $count);
    }
    
    /**
     * Get random teaching type.
     */
    private function getRandomTeachingType()
    {
        $types = ['Online', 'In-person', 'Both'];
        return $types[array_rand($types)];
    }
    
    /**
     * Get random teaching mode.
     */
    private function getRandomTeachingMode()
    {
        $modes = ['Full-time', 'Part-time'];
        return $modes[array_rand($modes)];
    }
    
    /**
     * Get random languages.
     */
    private function getRandomLanguages($min = 1, $max = 3)
    {
        $languages = [
            'English',
            'Arabic',
            'Urdu',
            'French',
            'Turkish',
            'Malay',
            'Indonesian',
            'Hindi',
            'Bengali',
            'Somali',
        ];
        
        shuffle($languages);
        $count = rand($min, $max);
        return array_slice($languages, 0, $count);
    }
    
    /**
     * Get random availability schedule.
     */
    private function getRandomAvailability($daysCount = null)
    {
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
        
        if ($daysCount === null) {
            $daysCount = rand(4, 7);
        }
        
        shuffle($days);
        $activeDays = array_slice($days, 0, $daysCount);
        
        foreach ($days as $day) {
            if (in_array($day, $activeDays)) {
                $slotCount = rand(1, 3);
                shuffle($timeSlots);
                $schedule[$day] = array_slice($timeSlots, 0, $slotCount);
            } else {
                $schedule[$day] = [];
            }
        }
        
        return $schedule;
    }
} 