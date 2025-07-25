<?php
require __DIR__ . "/vendor/autoload.php";

// Set error reporting to display all errors
error_reporting(E_ALL);
ini_set("display_errors", 1);

$app = require_once __DIR__ . "/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Subject;
use App\Models\User;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\DB;

echo "=== Testing Teacher-Subject Relationship ===\n\n";

// Create a test subject with a unique name
$testSubjectName = "Test Subject " . time();
echo "Creating test subject: {$testSubjectName}\n";

$subject = Subject::create([
    "name" => $testSubjectName,
    "is_active" => true
]);

echo "Subject created with ID: {$subject->id}\n\n";

// Find a teacher with a profile
$teacher = User::where("role", "teacher")
    ->has("teacherProfile")
    ->first();

if (!$teacher) {
    echo "No teacher with profile found. Exiting...\n";
    exit(1);
}

echo "Found teacher: {$teacher->name} (ID: {$teacher->id})\n";
$profile = $teacher->teacherProfile;

// Attach the subject to the teacher profile with primary flag
echo "Attaching subject to teacher as primary...\n";
$profile->subjects()->detach($subject->id); // Ensure no duplicates
$profile->subjects()->attach($subject->id, [
    "is_primary" => true,
    "created_at" => now(),
    "updated_at" => now()
]);

echo "Subject attached successfully.\n\n";

// Verify the relationship in the database
echo "Verifying teacher-subject relationship in database...\n";

$teacherWithSubjects = User::where("id", $teacher->id)
    ->with(["teacherProfile", "teacherProfile.subjects"])
    ->first();

echo "Teacher: {$teacherWithSubjects->name}\n";
echo "Subjects from relationship:\n";

foreach ($teacherWithSubjects->teacherProfile->subjects as $subj) {
    $isPrimary = $subj->pivot->is_primary ? "PRIMARY" : "Secondary";
    echo "- {$subj->name} (ID: {$subj->id}) [{$isPrimary}]\n";
}

// Check the raw fields in the teacher profile
echo "\nRaw fields in teacher profile:\n";
echo "teaching_subjects: " . ($profile->teaching_subjects ? json_encode($profile->teaching_subjects) : "NULL") . "\n";
echo "subject: " . ($profile->subject ? json_encode($profile->subject) : "NULL") . "\n";

// Check the pivot table directly
echo "\nDirect check of pivot table:\n";
$pivotRecords = DB::table("teacher_subject")
    ->where("teacher_profile_id", $profile->id)
    ->get();

echo "Found {$pivotRecords->count()} records in pivot table\n";
foreach ($pivotRecords as $record) {
    $subjectRecord = Subject::find($record->subject_id);
    $subjectName = $subjectRecord ? $subjectRecord->name : "Unknown";
    $isPrimary = $record->is_primary ? "PRIMARY" : "Secondary";
    echo "- Subject ID: {$record->subject_id}, Name: {$subjectName}, [{$isPrimary}]\n";
}

echo "\n=== Test Complete ===\n";
