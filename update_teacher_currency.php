<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Get all teacher profiles
$teacherProfiles = App\Models\TeacherProfile::all();

$count = 0;
foreach ($teacherProfiles as $profile) {
    // Set currency (randomly USD or NGN)
    $profile->currency = rand(0, 1) ? 'USD' : 'NGN';
    
    // Ensure hourly_rate is set
    if (!$profile->hourly_rate) {
        $profile->hourly_rate = rand(15, 100);
    }
    
    // Set amount_per_session based on hourly_rate
    $profile->amount_per_session = $profile->hourly_rate * 1.5;
    
    $profile->save();
    $count++;
}

echo "Updated {$count} teacher profiles with currency, hourly_rate, and amount_per_session.\n"; 