<?php
require __DIR__ . '/vendor/autoload.php';

// Set error reporting to display all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Subject;
use App\Models\User;
use App\Models\TeacherProfile;

echo "=== Checking Subjects in Database ===\n\n";

// Check all subjects
$subjects = Subject::all();
echo "Total subjects in database: " . $subjects->count() . "\n";
echo "Subjects:\n";
foreach ($subjects as $subject) {
    echo "- ID: {$subject->id}, Name: {$subject->name}\n";
}

echo "\n=== Checking Teacher-Subject Relationships ===\n\n";

// Get teachers with subjects
$teachers = User::where('role', 'teacher')
    ->with(['teacherProfile', 'teacherProfile.subjects'])
    ->take(5) // Limit to 5 teachers for brevity
    ->get();

echo "Total teachers (sample): " . $teachers->count() . "\n\n";

foreach ($teachers as $teacher) {
    echo "Teacher: {$teacher->name} (ID: {$teacher->id})\n";
    
    if (!$teacher->teacherProfile) {
        echo "  No teacher profile found.\n";
        continue;
    }
    
    $subjects = $teacher->teacherProfile->subjects;
    
    if ($subjects->isEmpty()) {
        echo "  No subjects assigned.\n";
    } else {
        echo "  Subjects (" . $subjects->count() . "):\n";
        foreach ($subjects as $subject) {
            $isPrimary = $subject->pivot->is_primary ? "PRIMARY" : "Secondary";
            echo "  - {$subject->name} (ID: {$subject->id}) [{$isPrimary}]\n";
        }
    }
    
    echo "\n";
}

echo "=== Checking TeacherProfile Data Format ===\n\n";

$profiles = TeacherProfile::take(3)->get();
foreach ($profiles as $profile) {
    echo "Profile ID: {$profile->id}, User ID: {$profile->user_id}\n";
    echo "  Teaching subjects (raw): " . ($profile->teaching_subjects ?? 'null') . "\n";
    echo "  Subject (raw): " . ($profile->subject ?? 'null') . "\n";
    
    // Get related subjects through relationship
    $relatedSubjects = $profile->subjects;
    echo "  Related subjects through relationship: " . $relatedSubjects->count() . "\n";
    foreach ($relatedSubjects as $subject) {
        echo "    - {$subject->name} (ID: {$subject->id})\n";
    }
    
    echo "\n";
}

echo "Done!\n"; 