<?php
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Storage Access Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
        .info {
            color: blue;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow: auto;
        }
    </style>
</head>
<body>
    <h1>Storage Access Test</h1>
    
    <?php
    // Test if storage link exists
    $storageLink = __DIR__ . '/storage';
    if (file_exists($storageLink)) {
        echo "<p class='success'>✓ Storage link exists at: " . $storageLink . "</p>";
        
        // Check if it's a symlink
        if (is_link($storageLink)) {
            echo "<p class='info'>Storage link is a symbolic link pointing to: " . readlink($storageLink) . "</p>";
        } else {
            echo "<p class='error'>Storage directory is not a symbolic link!</p>";
        }
    } else {
        echo "<p class='error'>✗ Storage link does not exist!</p>";
    }
    
    // Check storage path
    $storageRealPath = realpath(__DIR__ . '/../storage/app/public');
    if ($storageRealPath) {
        echo "<p class='success'>✓ Storage real path exists at: " . $storageRealPath . "</p>";
    } else {
        echo "<p class='error'>✗ Storage real path doesn't exist!</p>";
    }
    
    // Check permissions
    if ($storageRealPath) {
        $perms = substr(sprintf('%o', fileperms($storageRealPath)), -4);
        echo "<p>Storage directory permissions: " . $perms . "</p>";
        
        // Check if we can write to it
        if (is_writable($storageRealPath)) {
            echo "<p class='success'>✓ Storage directory is writable</p>";
        } else {
            echo "<p class='error'>✗ Storage directory is not writable!</p>";
        }
        
        // Check if we can read from it
        if (is_readable($storageRealPath)) {
            echo "<p class='success'>✓ Storage directory is readable</p>";
        } else {
            echo "<p class='error'>✗ Storage directory is not readable!</p>";
        }
    }
    
    // List files in teacher_documents directory
    $teacherDocsDir = $storageRealPath . '/teacher_documents';
    if (file_exists($teacherDocsDir)) {
        echo "<p class='success'>✓ Teacher documents directory exists</p>";
        
        echo "<h2>Teacher Documents Directory Structure:</h2>";
        echo "<pre>";
        
        function listFiles($dir, $indent = 0) {
            $files = scandir($dir);
            foreach ($files as $file) {
                if ($file != '.' && $file != '..') {
                    $fullPath = $dir . '/' . $file;
                    echo str_repeat('  ', $indent) . $file;
                    
                    if (is_dir($fullPath)) {
                        echo " (directory)\n";
                        listFiles($fullPath, $indent + 1);
                    } else {
                        echo " (" . filesize($fullPath) . " bytes)\n";
                    }
                }
            }
        }
        
        try {
            listFiles($teacherDocsDir);
        } catch (Exception $e) {
            echo "Error listing files: " . $e->getMessage();
        }
        
        echo "</pre>";
    } else {
        echo "<p class='error'>✗ Teacher documents directory doesn't exist!</p>";
    }
    
    // Test direct file access
    echo "<h2>Test Direct File Access:</h2>";
    
    // First find an actual image file to test
    $testFile = null;
    if (file_exists($teacherDocsDir)) {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($teacherDocsDir));
        foreach ($iterator as $file) {
            if ($file->isFile() && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file->getFilename())) {
                $testFile = str_replace($storageRealPath, '', $file->getPathname());
                break;
            }
        }
    }
    
    if ($testFile) {
        $fileUrl = '/storage' . $testFile;
        echo "<p>Testing file access for: " . $fileUrl . "</p>";
        echo "<p>Testing various URL formats:</p>";
        
        echo "<div style='display: flex; flex-wrap: wrap; gap: 20px;'>";
        
        // Test 1: Standard URL
        echo "<div>";
        echo "<p>Standard format:</p>";
        echo "<img src='" . $fileUrl . "' style='max-width: 200px; max-height: 200px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Failed to load'; this.style.border='1px solid red';\" />";
        echo "</div>";
        
        // Test 2: Without leading slash
        echo "<div>";
        echo "<p>Without leading slash:</p>";
        echo "<img src='storage" . $testFile . "' style='max-width: 200px; max-height: 200px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Failed to load'; this.style.border='1px solid red';\" />";
        echo "</div>";
        
        // Test 3: Direct full path
        echo "<div>";
        echo "<p>Direct path from root:</p>";
        echo "<img src='/storage/app/public" . $testFile . "' style='max-width: 200px; max-height: 200px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Failed to load'; this.style.border='1px solid red';\" />";
        echo "</div>";
        
        echo "</div>";
    } else {
        echo "<p class='error'>✗ No image files found to test!</p>";
    }
    ?>
    
    <h2>Server Information</h2>
    <pre>
<?php print_r($_SERVER); ?>
    </pre>
</body>
</html> 