<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\TeacherProfile;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Set up logging
Log::info('Starting teacher subjects fix script');

// Get all teacher profiles
$teacherProfiles = TeacherProfile::all();
$fixed = 0;
$errors = 0;
$alreadyOk = 0;
$noSubjectsData = 0;

echo "Starting to fix teacher subjects...\n";

foreach ($teacherProfiles as $profile) {
    try {
        echo "Processing teacher profile ID: {$profile->id} (User ID: {$profile->user_id})\n";
        
        // Check if this profile has subjects in the pivot table
        $existingSubjectsCount = $profile->subjects()->count();
        
        // If they already have subjects, skip
        if ($existingSubjectsCount > 0) {
            echo "  Teacher already has {$existingSubjectsCount} subjects.\n";
            $alreadyOk++;
            continue;
        }
        
        // Get the teaching_subjects from the profile
        $teachingSubjects = $profile->teaching_subjects;
        
        // If no teaching subjects, skip
        if (empty($teachingSubjects) || !is_array($teachingSubjects)) {
            echo "  Teacher has no teaching_subjects data.\n";
            $noSubjectsData++;
            continue;
        }
        
        echo "  Found " . count($teachingSubjects) . " teaching_subjects: " . implode(', ', $teachingSubjects) . "\n";
        
        // Add each subject
        foreach ($teachingSubjects as $index => $subjectName) {
            if (empty(trim($subjectName))) {
                continue;
            }
            
            // Find or create the subject
            $subject = Subject::firstOrCreate(
                ['name' => $subjectName],
                ['is_active' => true]
            );
            
            // Attach the subject to the teacher profile
            $profile->subjects()->attach($subject->id, [
                'is_primary' => ($index === 0), // First subject is primary
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            echo "  - Added subject: {$subjectName} (ID: {$subject->id})\n";
        }
        
        $fixed++;
        
    } catch (\Exception $e) {
        echo "Error processing teacher profile {$profile->id}: " . $e->getMessage() . "\n";
        Log::error("Error fixing teacher profile {$profile->id} subjects: " . $e->getMessage());
        $errors++;
    }
}

echo "\nTeacher subjects fix completed:\n";
echo "- Fixed: {$fixed}\n";
echo "- Already OK: {$alreadyOk}\n";
echo "- No subjects data: {$noSubjectsData}\n";
echo "- Errors: {$errors}\n";
Log::info("Teacher subjects fix completed: Fixed: {$fixed}, Already OK: {$alreadyOk}, No subjects data: {$noSubjectsData}, Errors: {$errors}"); 