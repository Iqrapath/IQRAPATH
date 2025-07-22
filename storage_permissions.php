<?php

// This script should be run from the Laravel CLI using:
// php artisan tinker --execute="require('storage_permissions.php');"

// Import necessary Laravel facades
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

// Check if storage_link exists
if (!File::exists(public_path('storage'))) {
    echo "Storage link does not exist. Creating it...\n";
    Artisan::call('storage:link');
    echo Artisan::output();
} else {
    echo "Storage link exists.\n";
}

// Check permissions on storage directory
$storagePath = storage_path('app/public');
$publicStoragePath = public_path('storage');

echo "Storage path: {$storagePath}\n";
echo "Public storage path: {$publicStoragePath}\n";

// Check if directories exist
if (!File::isDirectory($storagePath)) {
    echo "Storage directory doesn't exist. Creating it...\n";
    File::makeDirectory($storagePath, 0755, true);
}

// Check permissions
echo "Storage directory permissions: " . substr(sprintf('%o', fileperms($storagePath)), -4) . "\n";
echo "Public storage directory permissions: " . substr(sprintf('%o', fileperms($publicStoragePath)), -4) . "\n";

// Check if teacher_documents directory exists
$teacherDocsPath = $storagePath . '/teacher_documents';
if (!File::isDirectory($teacherDocsPath)) {
    echo "Teacher documents directory doesn't exist. Creating it...\n";
    File::makeDirectory($teacherDocsPath, 0755, true);
} else {
    echo "Teacher documents directory exists.\n";
}

// Ensure permissions are correct
chmod($storagePath, 0755);
chmod($publicStoragePath, 0755);
if (File::isDirectory($teacherDocsPath)) {
    chmod($teacherDocsPath, 0755);
    echo "Set permissions on teacher documents directory.\n";
}

echo "Done checking storage permissions.\n"; 