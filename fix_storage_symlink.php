<?php

/**
 * This script fixes issues with storage symlinks
 * It ensures the public/storage directory is properly linked to storage/app/public
 */

// Get the application base path
$basePath = __DIR__;

// Check if the storage directory exists
if (!is_dir($basePath . '/storage')) {
    echo "Error: Storage directory not found!\n";
    exit(1);
}

// Check if the public directory exists
if (!is_dir($basePath . '/public')) {
    echo "Error: Public directory not found!\n";
    exit(1);
}

// Remove existing symlink if it exists
$symlinkPath = $basePath . '/public/storage';
if (file_exists($symlinkPath)) {
    if (is_link($symlinkPath)) {
        echo "Removing existing symlink...\n";
        unlink($symlinkPath);
    } else {
        echo "Error: {$symlinkPath} exists but is not a symlink. Please remove it manually.\n";
        exit(1);
    }
}

// Create the storage/app/public directory if it doesn't exist
$publicStoragePath = $basePath . '/storage/app/public';
if (!is_dir($publicStoragePath)) {
    echo "Creating storage/app/public directory...\n";
    mkdir($publicStoragePath, 0755, true);
}

// Create the symlink
echo "Creating symlink...\n";
if (symlink($basePath . '/storage/app/public', $symlinkPath)) {
    echo "Symlink created successfully!\n";
} else {
    echo "Failed to create symlink. Please check permissions.\n";
    exit(1);
}

// Check if the avatars directory exists in storage/app/public
$avatarsPath = $publicStoragePath . '/avatars';
if (!is_dir($avatarsPath)) {
    echo "Creating avatars directory in storage/app/public...\n";
    mkdir($avatarsPath, 0755, true);
}

// Check if the teacher_documents directory exists in storage/app/public
$teacherDocsPath = $publicStoragePath . '/teacher_documents';
if (!is_dir($teacherDocsPath)) {
    echo "Creating teacher_documents directory in storage/app/public...\n";
    mkdir($teacherDocsPath, 0755, true);
}

echo "Storage setup completed successfully!\n"; 