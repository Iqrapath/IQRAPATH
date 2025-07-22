<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

echo "Starting to fix teacher subjects UI...\n";

// Get all teachers
$teachers = User::where('role', 'teacher')->get();
echo "Found " . $teachers->count() . " teachers\n";

// Create subjects if they don't exist
$subjects = [
    'Quran Recitation' => true,
    'Tajweed' => false,
    'Hifz' => false,
    'Arabic Language' => false,
    'Islamic Studies' => false
];

$subjectModels = [];
foreach ($subjects as $name => $isPrimary) {
    $subjectModels[$name] = Subject::firstOrCreate(
        ['name' => $name],
        ['is_active' => true]
    );
    echo "Subject: {$name} (ID: {$subjectModels[$name]->id})\n";
}

// Process each teacher
foreach ($teachers as $teacher) {
    echo "\nProcessing teacher: {$teacher->name} (ID: {$teacher->id})\n";
    
    // Check if teacher has a profile
    $profile = $teacher->teacherProfile;
    
    if (!$profile) {
        echo "  Creating profile for teacher {$teacher->name}\n";
        $profile = new TeacherProfile();
        $profile->user_id = $teacher->id;
        $profile->save();
    }
    
    // Check if teacher has subjects
    $existingSubjects = $profile->subjects;
    echo "  Found {$existingSubjects->count()} existing subjects\n";
    
    if ($existingSubjects->count() === 0) {
        echo "  Adding default subjects to teacher {$teacher->name}\n";
        
        // Add default subjects
        foreach ($subjects as $name => $isPrimary) {
            $profile->subjects()->attach($subjectModels[$name]->id, [
                'is_primary' => $isPrimary,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            echo "    Added subject: {$name} (isPrimary: " . ($isPrimary ? "yes" : "no") . ")\n";
        }
    } else {
        echo "  Teacher already has subjects, skipping\n";
    }
}

echo "\nTeacher subjects UI fix completed!\n"; 