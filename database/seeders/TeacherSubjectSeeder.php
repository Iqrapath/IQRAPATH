<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all teachers and subjects
        $teachers = TeacherProfile::all();
        $subjects = Subject::all();

        if ($teachers->isEmpty()) {
            $this->command->info('No teachers found. Creating some teachers...');
            User::factory()->count(5)->create(['role' => 'teacher'])->each(function ($user) {
                TeacherProfile::factory()->create(['user_id' => $user->id]);
            });
            $teachers = TeacherProfile::all();
        }

        if ($subjects->isEmpty()) {
            $this->command->info('No subjects found. Running SubjectSeeder...');
            $this->call(SubjectSeeder::class);
            $subjects = Subject::all();
        }

        // Clear existing relationships safely
        DB::table('teacher_subject')->delete();

        // Assign subjects to teachers
        foreach ($teachers as $teacher) {
            // Assign 2-5 random subjects to each teacher
            $subjectCount = rand(2, 5);
            $selectedSubjects = $subjects->random($subjectCount);
            
            // Choose a primary subject
            $primarySubject = $selectedSubjects->random();
            
            foreach ($selectedSubjects as $subject) {
                DB::table('teacher_subject')->insert([
                    'teacher_profile_id' => $teacher->id,
                    'subject_id' => $subject->id,
                    'is_primary' => ($subject->id === $primarySubject->id),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Teacher-subject relationships created successfully.');
    }
}
