<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Get all teachers
$teachers = App\Models\User::where('role', 'teacher')->get();

$count = 0;
foreach ($teachers as $teacher) {
    $avatarNumber = rand(1, 5);
    $teacher->avatar = "/assets/images/teachers/teacher{$avatarNumber}.png";
    $teacher->save();
    $count++;
}

echo "Updated {$count} teacher avatars.\n"; 