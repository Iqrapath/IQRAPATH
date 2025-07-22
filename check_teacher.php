<?php

require __DIR__.'/vendor/autoload.php';

echo "Script starting...\n";
echo "Autoloader loaded...\n";

$app = require_once __DIR__.'/bootstrap/app.php';
echo "App loaded...\n";

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
echo "Kernel bootstrapped...\n";

use App\Models\Subject;
use App\Models\User;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\DB;

// Create a test subject
$testSubjectName = "Test Subject " . time();
echo "Creating test subject: {$testSubjectName}\n";

$subject = Subject::create([
    'name' => $testSubjectName,
    'is_active' => true
]);

echo "Subject created with ID: {$subject->id}\n\n";

// Find a teacher to test with
$teacher = User::where('role', 'teacher')
    ->has('teacherProfile')
    ->first();

if ($teacher) {
    echo "Found existing teacher: {$teacher->name} (ID: {$teacher->id})\n";
    $profile = $teacher->teacherProfile;
    
    // Attach the test subject to the teacher
    echo "Attaching subject to teacher...\n";
    $profile->subjects()->attach($subject->id, [
        'is_primary' => true,
        'created_at' => now(),
        'updated_at' => now()
    ]);
    
    echo "Subject attached successfully.\n\n";
    
    // Verify the relationship
    echo "Verifying teacher-subject relationship...\n";
    $teacherWithSubjects = User::where('id', $teacher->id)
        ->with(['teacherProfile', 'teacherProfile.subjects'])
        ->first();
    
    echo "Teacher: {$teacherWithSubjects->name}\n";
    echo "Subjects:\n";
    
    foreach ($teacherWithSubjects->teacherProfile->subjects as $subject) {
        $isPrimary = $subject->pivot->is_primary ? "PRIMARY" : "Secondary";
        echo "- {$subject->name} (ID: {$subject->id}) [{$isPrimary}]\n";
    }
} else {
    echo "No teacher with profile found.\n";
}

echo "\n=== Test Complete ===\n";
