<?php

// Set error reporting to maximum level
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load Laravel's autoloader
require __DIR__ . '/vendor/autoload.php';

// Load the .env file
$app = require_once __DIR__ . '/bootstrap/app.php';

// Start the app
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Disable CSRF for this script
app('config')->set('app.debug', true);
app('config')->set('session.driver', 'array');
app('config')->set('app.middleware', []);
app('config')->set('session.middleware', []);

// Get the kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Create a test user with the required data
$testData = [
    'user' => [
        'name' => 'Test Student',
        'email' => 'test.student' . time() . '@example.com',
        'phone_number' => '1234567890',
        'location' => 'Test Location',
        'status' => 'active',
        'registration_date' => date('Y-m-d')
    ],
    'preferences' => [
        'preferredSubjects' => ['Hifz', 'Tajweed'],
        'teachingMode' => 'full-time',
        'studentAgeGroup' => '7-9 Years',
        'preferredLearningTimes' => [
            [
                'day' => 'Monday',
                'fromTime' => '09:00 AM',
                'toTime' => '11:00 AM',
                'isSelected' => true
            ]
        ],
        'additionalNotes' => 'Test notes'
    ],
    'subscription' => [
        'activePlan' => "Juz' Amma - ₦10,000/month",
        'startDate' => date('Y-m-d'),
        'endDate' => date('Y-m-d', strtotime('+3 months')),
        'status' => 'active',
        'additionalNotes' => 'Test subscription notes'
    ]
];

// Call the controller directly instead of going through the router
try {
    $controller = app()->make(\App\Http\Controllers\StudentController::class);
    $request = new Illuminate\Http\Request();
    $request->replace($testData);

    $response = $controller->store($request);
    echo "Controller response: " . PHP_EOL;
    echo $response->getContent() . PHP_EOL;
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . PHP_EOL;
    echo "File: " . $e->getFile() . " (Line: " . $e->getLine() . ")" . PHP_EOL;
    echo "Stack trace: " . PHP_EOL . $e->getTraceAsString() . PHP_EOL;
}
