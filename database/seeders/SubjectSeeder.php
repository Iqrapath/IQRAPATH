<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define common Islamic subjects
        $subjects = [
            'Quran Recitation',
            'Hifz (Memorization)',
            'Tajweed',
            'Tafsir',
            'Arabic Language',
            'Islamic Studies',
            'Fiqh',
            'Aqeedah',
            'Hadith',
            'Seerah',
        ];

        // Use firstOrCreate to avoid unique constraint violations
        foreach ($subjects as $subject) {
            Subject::firstOrCreate(
                ['name' => $subject],
                ['is_active' => true]
            );
        }

        // Create a few random subjects for testing with unique names
        for ($i = 0; $i < 3; $i++) {
            Subject::firstOrCreate(
                ['name' => 'Custom Subject ' . uniqid()],
                ['is_active' => true]
            );
        }
        
        $this->command->info('Subjects seeded successfully.');
    }
} 