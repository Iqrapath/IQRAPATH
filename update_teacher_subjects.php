<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Define possible subjects
$quranSubjects = ['Tajweed', 'Hifz', 'Qira\'ah', 'Tafsir'];
$islamicSubjects = ['Fiqh', 'Aqeedah', 'Seerah', 'Arabic Language', 'Islamic History'];
$allSubjects = array_merge($quranSubjects, $islamicSubjects);

// Get all teacher profiles
$teacherProfiles = App\Models\TeacherProfile::all();

$count = 0;
foreach ($teacherProfiles as $profile) {
    // Randomly select 1-3 subjects
    $numSubjects = rand(1, 3);
    $selectedSubjects = array_values(array_intersect_key(
        $allSubjects, 
        array_flip(array_rand($allSubjects, $numSubjects))
    ));
    
    // Update the teacher profile
    $profile->teaching_subjects = $selectedSubjects;
    $profile->save();
    
    $count++;
}

echo "Updated teaching subjects for {$count} teacher profiles.\n"; 