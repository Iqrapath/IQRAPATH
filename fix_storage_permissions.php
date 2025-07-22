<?php

echo "Starting storage permissions fix...\n";

// Check if running on Windows
$isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
echo "Operating System: " . ($isWindows ? "Windows" : "Unix-like") . "\n";

// Path to storage directory
$storagePath = __DIR__ . '/storage';
$publicStoragePath = __DIR__ . '/storage/app/public';
$publicStorageLink = __DIR__ . '/public/storage';

echo "Storage path: $storagePath\n";
echo "Public storage path: $publicStoragePath\n";
echo "Public storage link: $publicStorageLink\n";

// Check if storage directory exists
if (!file_exists($storagePath)) {
    echo "ERROR: Storage directory does not exist!\n";
    exit(1);
}

// Check if public storage directory exists
if (!file_exists($publicStoragePath)) {
    echo "Creating public storage directory...\n";
    mkdir($publicStoragePath, 0755, true);
}

// Check if avatars directory exists
$avatarsPath = $publicStoragePath . '/avatars';
if (!file_exists($avatarsPath)) {
    echo "Creating avatars directory...\n";
    mkdir($avatarsPath, 0755, true);
}

// Check if public storage link exists
if (!file_exists($publicStorageLink)) {
    echo "Public storage link does not exist. Running storage:link...\n";
    exec('php artisan storage:link', $output, $returnVar);
    echo implode("\n", $output) . "\n";
} else {
    echo "Public storage link exists.\n";
    
    // Check if it's a symlink or a directory
    if (is_link($publicStorageLink)) {
        echo "It's a proper symlink.\n";
    } else {
        echo "WARNING: It's not a symlink! Removing and recreating...\n";
        
        // Remove existing directory
        if ($isWindows) {
            exec('rmdir /S /Q "' . $publicStorageLink . '"', $output, $returnVar);
        } else {
            exec('rm -rf "' . $publicStorageLink . '"', $output, $returnVar);
        }
        
        // Create symlink
        exec('php artisan storage:link', $output, $returnVar);
        echo implode("\n", $output) . "\n";
    }
}

// Set permissions on storage directory
echo "Setting permissions on storage directory...\n";
if ($isWindows) {
    echo "On Windows, permissions are handled differently. Please ensure XAMPP has proper access.\n";
} else {
    exec('chmod -R 755 "' . $storagePath . '"', $output, $returnVar);
    exec('chown -R www-data:www-data "' . $storagePath . '"', $output, $returnVar);
}

// Create a test file
$testFile = $publicStoragePath . '/test.txt';
echo "Creating test file at $testFile...\n";
file_put_contents($testFile, 'This is a test file to check if storage is working properly.');

echo "\nStorage permissions fix completed.\n";
echo "Please check if you can access http://your-site.test/storage/test.txt\n"; 