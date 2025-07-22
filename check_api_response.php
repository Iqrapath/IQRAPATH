<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create a dummy request
$request = new Illuminate\Http\Request();

// Create the controller and get the response
$controller = new App\Http\Controllers\API\TeacherController();
$response = $controller->getRecommendedTeachers($request);

// Decode the response
$data = json_decode($response->getContent(), true);

echo "API Response:\n";
echo json_encode($data, JSON_PRETTY_PRINT);

// Check the teachers data
if (isset($data['data']['teachers']) && is_array($data['data']['teachers'])) {
    $teachers = $data['data']['teachers'];
    echo "\n\nFound " . count($teachers) . " teachers in response\n";
    
    foreach ($teachers as $index => $teacher) {
        echo "\nTeacher #" . ($index + 1) . ": " . $teacher['name'] . "\n";
        
        if (isset($teacher['subjects'])) {
            if (is_array($teacher['subjects']) && !empty($teacher['subjects'])) {
                echo "Subjects: " . implode(", ", $teacher['subjects']) . "\n";
            } else {
                echo "Subjects: Empty array\n";
            }
        } else {
            echo "Subjects: NOT SET\n";
        }
    }
} else {
    echo "\n\nNo teachers found in response\n";
} 