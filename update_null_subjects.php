<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Define possible subjects
$quranSubjects = ['Tajweed', 'Hifz', 'Qira\'ah', 'Tafsir'];
$islamicSubjects = ['Fiqh', 'Aqeedah', 'Seerah', 'Arabic Language', 'Islamic History'];
$allSubjects = array_merge($quranSubjects, $islamicSubjects);

// Get all teacher profiles with NULL teaching_subjects
$teacherProfiles = App\Models\TeacherProfile::whereNull('teaching_subjects')->get();

$count = 0;
foreach ($teacherProfiles as $profile) {
    // Randomly select 1-3 subjects
    $numSubjects = min(rand(1, 3), count($allSubjects));
    
    // Handle array_rand differently based on number of subjects
    if ($numSubjects === 1) {
        $selectedKeys = [array_rand($allSubjects)];
    } else {
        $selectedKeys = array_rand($allSubjects, $numSubjects);
    }
    
    $selectedSubjects = [];
    foreach ($selectedKeys as $key) {
        $selectedSubjects[] = $allSubjects[$key];
    }
    
    // Update the teacher profile
    $profile->teaching_subjects = $selectedSubjects;
    $profile->save();
    
    $count++;
}

echo "Updated teaching subjects for {$count} teacher profiles with NULL subjects.\n"; 