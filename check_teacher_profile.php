<?php

echo "Script starting...\n";

// Import DB facade
use Illuminate\Support\Facades\DB;

try {
    require __DIR__.'/vendor/autoload.php';
    echo "Autoloader loaded...\n";

    $app = require_once __DIR__.'/bootstrap/app.php';
    echo "App loaded...\n";

    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    echo "Kernel bootstrapped...\n";

    // Count teacher profiles
    $count = App\Models\TeacherProfile::count();
    echo "Total teacher profiles: {$count}" . PHP_EOL;

    // Check if there are any users with role 'teacher'
    $teacherCount = App\Models\User::where('role', 'teacher')->count();
    echo "Total users with role 'teacher': {$teacherCount}" . PHP_EOL;

    // Get a teacher profile
    $profile = App\Models\TeacherProfile::with('user')->first();

    if ($profile) {
        echo "Teacher Profile ID: " . $profile->id . PHP_EOL;
        echo "User ID: " . $profile->user_id . PHP_EOL;
        echo "Name: " . $profile->user->name . PHP_EOL;
        echo "Hourly Rate: " . $profile->hourly_rate . " (type: " . gettype($profile->hourly_rate) . ")" . PHP_EOL;
        echo "Currency: " . $profile->currency . " (type: " . gettype($profile->currency) . ")" . PHP_EOL;
        echo "Amount Per Session: " . $profile->amount_per_session . " (type: " . gettype($profile->amount_per_session) . ")" . PHP_EOL;
        
        // Teaching subjects
        echo "Teaching Subjects: " . PHP_EOL;
        if (is_array($profile->teaching_subjects)) {
            foreach ($profile->teaching_subjects as $subject) {
                echo "- " . $subject . PHP_EOL;
            }
        } else {
            echo "No subjects found or not in array format." . PHP_EOL;
        }
    } else {
        echo "No teacher profile found." . PHP_EOL;
        
        // Try to get a raw teacher profile
        $rawProfile = DB::table('teacher_profiles')->first();
        if ($rawProfile) {
            echo "Found a raw teacher profile in the database:" . PHP_EOL;
            print_r($rawProfile);
        } else {
            echo "No raw teacher profiles found in the database." . PHP_EOL;
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
    echo "File: " . $e->getFile() . PHP_EOL;
    echo "Line: " . $e->getLine() . PHP_EOL;
}

// Set error reporting to display all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Subject;
use App\Models\User;
use App\Models\TeacherProfile;

echo "=== Testing Teacher Profile and Subjects Relationship ===\n\n";

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

if (!$teacher) {
    echo "No teacher with profile found. Creating a test teacher...\n";
    
    // Create a test teacher
    $teacher = User::create([
        'name' => 'Test Teacher',
        'email' => 'test_teacher_' . time() . '@example.com',
        'password' => bcrypt('password'),
        'role' => 'teacher',
        'status' => 'active'
    ]);
    
    // Create teacher profile
    $profile = TeacherProfile::create([
        'user_id' => $teacher->id,
        'bio' => 'Test teacher bio',
        'years_of_experience' => 5,
        'teaching_type' => 'Online',
        'teaching_mode' => 'Part-time'
    ]);
    
    echo "Created test teacher with ID: {$teacher->id}\n";
} else {
    echo "Found existing teacher: {$teacher->name} (ID: {$teacher->id})\n";
    $profile = $teacher->teacherProfile;
}

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

echo "\n=== Test Complete ===\n";
