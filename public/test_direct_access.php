<?php
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Direct Document Access Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .info { color: blue; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
        .test-card { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .test-title { font-weight: bold; margin-bottom: 10px; }
        img { max-width: 300px; max-height: 300px; border: 1px solid #ddd; display: block; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Direct Document Access Test</h1>
    
    <?php
    // Look for image files in the teacher_documents directory
    $storageDir = realpath(__DIR__ . '/../storage/app/public/teacher_documents');
    $testFiles = [];
    
    if (is_dir($storageDir)) {
        echo "<p class='success'>✓ Teacher documents directory exists at: {$storageDir}</p>";
        
        // Use RecursiveIteratorIterator to get all files
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($storageDir, RecursiveDirectoryIterator::SKIP_DOTS)
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile() && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file->getFilename())) {
                $path = str_replace('\\', '/', $file->getPathname());
                $relativePath = str_replace(realpath(__DIR__ . '/../storage/app/public') . '/', '', $path);
                
                // Parse the path to extract components
                $pattern = '/^teacher_documents\/(\d+)\/([^\/]+)\/(.+)$/';
                if (preg_match($pattern, $relativePath, $matches)) {
                    $teacherId = $matches[1];
                    $docType = $matches[2];
                    $filename = $matches[3];
                    
                    $testFiles[] = [
                        'fullPath' => $file->getPathname(),
                        'relativePath' => $relativePath,
                        'teacherId' => $teacherId,
                        'docType' => $docType,
                        'filename' => $filename,
                        'size' => $file->getSize()
                    ];
                }
            }
        }
        
        if (count($testFiles) > 0) {
            echo "<p class='success'>✓ Found " . count($testFiles) . " image files to test</p>";
        } else {
            echo "<p class='error'>✗ No image files found in teacher_documents directory</p>";
        }
    } else {
        echo "<p class='error'>✗ Teacher documents directory doesn't exist!</p>";
    }
    
    // Test accessing files through different methods
    if (count($testFiles) > 0) {
        echo "<h2>Testing File Access Methods</h2>";
        
        foreach ($testFiles as $index => $file) {
            echo "<div class='test-card'>";
            echo "<div class='test-title'>Test File #{$index}: {$file['filename']}</div>";
            echo "<p>Path: {$file['relativePath']}</p>";
            echo "<p>Size: {$file['size']} bytes</p>";
            
            // Method 1: Direct storage URL
            $storageUrl = "/storage/{$file['relativePath']}";
            echo "<p>Method 1: Storage URL</p>";
            echo "<p><code>{$storageUrl}</code></p>";
            echo "<img src='{$storageUrl}' onerror=\"this.onerror=null; this.style.border='1px solid red'; this.alt='❌ Failed to load'; this.style.height='40px'\" alt='Storage URL Test' />";
            
            // Method 2: Using new direct route
            $directUrl = "/document/{$file['docType']}/{$file['teacherId']}/{$file['filename']}";
            echo "<p>Method 2: Direct Route</p>";
            echo "<p><code>{$directUrl}</code></p>";
            echo "<img src='{$directUrl}' onerror=\"this.onerror=null; this.style.border='1px solid red'; this.alt='❌ Failed to load'; this.style.height='40px'\" alt='Direct Route Test' />";
            
            // Method 3: Direct PHP script
            $phpUrl = "/test_image.php?path={$file['relativePath']}";
            echo "<p>Method 3: PHP Script</p>";
            echo "<p><code>{$phpUrl}</code></p>";
            echo "<img src='{$phpUrl}' onerror=\"this.onerror=null; this.style.border='1px solid red'; this.alt='❌ Failed to load'; this.style.height='40px'\" alt='PHP Script Test' />";
            
            echo "</div>";
        }
    }
    ?>
    
    <h2>Server Information</h2>
    <pre>
<?php echo "PHP Version: " . phpversion(); ?>

<?php print_r($_SERVER); ?>
    </pre>
</body>
</html> 