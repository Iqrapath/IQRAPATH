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
    echo "Plan Description: " . $session->subscriptionPlan->description . PHP_EOL;
} else {
    echo "No subscription plan found." . PHP_EOL;
}

// Check subject_names attribute
echo "Subject Names: " . implode(", ", $session->subject_names) . PHP_EOL;

// Check student
$student = App\Models\User::find($session->student_id);
if ($student) {
    echo "Student: " . $student->name . PHP_EOL;
    
    // Check student's subscriptions
    $subscriptions = $student->subscriptions;
    echo "Student has " . $subscriptions->count() . " subscriptions" . PHP_EOL;
    
    foreach ($subscriptions as $subscription) {
        echo "- Subscription ID: " . $subscription->id . PHP_EOL;
        echo "  Plan: " . ($subscription->plan ? $subscription->plan->name : 'None') . PHP_EOL;
        echo "  Status: " . $subscription->status . PHP_EOL;
    }
}

// Count sessions with subscription plans
$totalSessions = App\Models\TeachingSession::count();
$sessionsWithPlans = App\Models\TeachingSession::whereNotNull('subscription_plan_id')->count();

echo PHP_EOL . "Total Sessions: " . $totalSessions . PHP_EOL;
echo "Sessions with Plans: " . $sessionsWithPlans . PHP_EOL;

// Check a few random sessions
echo PHP_EOL . "Checking 5 random sessions:" . PHP_EOL;
$randomSessions = App\Models\TeachingSession::inRandomOrder()->limit(5)->get();

foreach ($randomSessions as $i => $session) {
    echo "- Session " . ($i + 1) . ":" . PHP_EOL;
    echo "  ID: " . $session->id . PHP_EOL;
    echo "  Subject: " . $session->subject . PHP_EOL;
    echo "  Plan: " . ($session->subscriptionPlan ? $session->subscriptionPlan->name : 'None') . PHP_EOL;
    
    $student = App\Models\User::find($session->student_id);
    echo "  Student: " . ($student ? $student->name : 'Unknown') . PHP_EOL;
    
    if ($student) {
        $studentProfile = $student->studentProfile;
        if ($studentProfile) {
            echo "  Age Group: " . $studentProfile->age_group . PHP_EOL;
        }
        
        $activeSubscription = $student->subscriptions()->where('status', 'active')->first();
        if ($activeSubscription && $activeSubscription->plan) {
            echo "  Active Subscription: " . $activeSubscription->plan->name . PHP_EOL;
        }
    }
    
    echo "  Subject Names: " . implode(", ", $session->subject_names) . PHP_EOL;
    echo PHP_EOL;
} 