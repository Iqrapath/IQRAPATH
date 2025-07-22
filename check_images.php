<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Get a teaching session
$session = App\Models\TeachingSession::first();

echo "Session ID: " . $session->id . PHP_EOL;
echo "Subject: " . $session->subject . PHP_EOL;
echo "Plan ID: " . $session->subscription_plan_id . PHP_EOL;

// Check subscription plan
if ($session->subscriptionPlan) {
    echo "Plan Name: " . $session->subscriptionPlan->name . PHP_EOL;
    echo "Plan Image: " . $session->subscriptionPlan->image . PHP_EOL;
} else {
    echo "No subscription plan found." . PHP_EOL;
}

// Check image accessor
echo "Image Accessor: " . $session->image . PHP_EOL;

// Check a few random sessions
echo PHP_EOL . "Checking 3 random sessions:" . PHP_EOL;
$randomSessions = App\Models\TeachingSession::inRandomOrder()->limit(3)->get();

foreach ($randomSessions as $i => $session) {
    echo "- Session " . ($i + 1) . ":" . PHP_EOL;
    echo "  ID: " . $session->id . PHP_EOL;
    echo "  Subject: " . $session->subject . PHP_EOL;
    echo "  Plan: " . ($session->subscriptionPlan ? $session->subscriptionPlan->name : 'None') . PHP_EOL;
    echo "  Plan Image: " . ($session->subscriptionPlan ? $session->subscriptionPlan->image : 'None') . PHP_EOL;
    echo "  Image Accessor: " . $session->image . PHP_EOL;
    echo PHP_EOL;
} 