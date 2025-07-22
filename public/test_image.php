<?php
// Get file path from query string
$filePath = $_GET['path'] ?? null;

if (!$filePath) {
    die('No file path specified');
}

// Security check - only allow files from the teacher_documents directory
if (!preg_match('/^teacher_documents\//', $filePath)) {
    die('Invalid file path. Only teacher_documents paths are allowed.');
}

// Full path to the file in storage
$fullPath = __DIR__ . '/../storage/app/public/' . $filePath;

// Check if file exists
if (!file_exists($fullPath)) {
    die('File does not exist: ' . $fullPath);
}

// Get file info
$fileInfo = pathinfo($fullPath);
$extension = strtolower($fileInfo['extension'] ?? '');

// Set appropriate content type
switch ($extension) {
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    case 'pdf':
        header('Content-Type: application/pdf');
        break;
    default:
        header('Content-Type: application/octet-stream');
}

// Output the file
readfile($fullPath);
exit; 