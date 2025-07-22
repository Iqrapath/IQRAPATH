<?php

// Basic paths
$basePath = __DIR__;
$storagePath = $basePath . '/storage/app/public';
$publicStoragePath = $basePath . '/public/storage';
$teacherDocsPath = $storagePath . '/teacher_documents';

echo "Checking and fixing storage permissions...\n";

// Check if storage directory exists
if (!is_dir($storagePath)) {
    echo "Creating storage directory: {$storagePath}\n";
    mkdir($storagePath, 0755, true);
}

// Check if public/storage exists (symlink)
if (!file_exists($publicStoragePath)) {
    echo "Storage symlink doesn't exist. Please run 'php artisan storage:link'\n";
} else {
    echo "Storage symlink exists.\n";
}

// Check if teacher_documents directory exists
if (!is_dir($teacherDocsPath)) {
    echo "Creating teacher documents directory: {$teacherDocsPath}\n";
    mkdir($teacherDocsPath, 0755, true);
} else {
    echo "Teacher documents directory exists.\n";
}

// Fix permissions
echo "Setting permissions on directories...\n";
chmod($storagePath, 0755);
if (is_dir($publicStoragePath) && !is_link($publicStoragePath)) {
    chmod($publicStoragePath, 0755);
}
chmod($teacherDocsPath, 0755);

// Create test directories for each teacher ID (1-5)
for ($i = 1; $i <= 5; $i++) {
    $teacherDir = $teacherDocsPath . '/' . $i;
    if (!is_dir($teacherDir)) {
        echo "Creating directory for teacher ID {$i}\n";
        mkdir($teacherDir, 0755, true);
    }
    
    // Create subdirectories for each document type
    $docTypes = ['id_front', 'id_back', 'certificate', 'resume'];
    foreach ($docTypes as $type) {
        $typeDir = $teacherDir . '/' . $type;
        if (!is_dir($typeDir)) {
            echo "Creating {$type} directory for teacher ID {$i}\n";
            mkdir($typeDir, 0755, true);
        }
    }
}

echo "\nStorage permissions fixed! Please check if documents are now accessible.\n";
echo "If still having issues, check your web server configuration and ensure\n";
echo "that the web server has read access to these directories.\n"; 