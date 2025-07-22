<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DownloadDefaultPlanImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:download-default-images {--force : Force re-download even if images already exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download default subscription plan images from public URLs';

    /**
     * Default image URLs for subscription plans
     */
    protected $defaultImages = [
        'juz-amma.jpg' => 'https://images.pexels.com/photos/5899410/pexels-photo-5899410.jpeg',
        'half-quran.jpg' => 'https://images.pexels.com/photos/5752276/pexels-photo-5752276.jpeg',
        'full-quran.jpg' => 'https://images.pexels.com/photos/5752279/pexels-photo-5752279.jpeg',
        'tajweed-basics.jpg' => 'https://images.pexels.com/photos/6942436/pexels-photo-6942436.jpeg',
        'advanced-tajweed.jpg' => 'https://images.pexels.com/photos/8941045/pexels-photo-8941045.jpeg',
        'islamic-studies.jpg' => 'https://images.pexels.com/photos/6944172/pexels-photo-6944172.jpeg',
        'quranic-arabic.jpg' => 'https://images.pexels.com/photos/6009066/pexels-photo-6009066.jpeg',
        'juz-amma-annual.jpg' => 'https://images.pexels.com/photos/6944100/pexels-photo-6944100.jpeg',
        'full-quran-annual.jpg' => 'https://images.pexels.com/photos/7546293/pexels-photo-7546293.jpeg',
        'default.jpg' => 'https://images.pexels.com/photos/5899424/pexels-photo-5899424.jpeg',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Downloading default subscription plan images...');
        
        // Create storage directory if it doesn't exist
        $storagePath = 'public/assets/images/classes';
        if (!Storage::exists($storagePath)) {
            Storage::makeDirectory($storagePath);
            $this->info("Created directory: {$storagePath}");
        }
        
        $downloaded = 0;
        
        $this->output->progressStart(count($this->defaultImages));
        
        foreach ($this->defaultImages as $filename => $url) {
            $path = "{$storagePath}/{$filename}";
            
            // Skip if file already exists and force option is not used
            if (Storage::exists($path) && !$this->option('force')) {
                $this->info("Skipping {$filename} (already exists)");
                $this->output->progressAdvance();
                continue;
            }
            
            $maxRetries = 3;
            $attempt = 0;
            $success = false;
            
            while ($attempt < $maxRetries && !$success) {
                $attempt++;
                
                try {
                    // Use HTTP client with proper headers for better reliability
                    $response = Http::withHeaders([
                        'User-Agent' => 'IQRAPATH/1.0 (edu-platform; subscription-plan-images)',
                        'Accept' => 'image/jpeg,image/png,*/*'
                    ])->timeout(15)->get($url);
                    
                    if ($response->successful()) {
                        Storage::put($path, $response->body());
                        $downloaded++;
                        $success = true;
                        
                        $this->line("Downloaded image: {$filename} (Attempt {$attempt})");
                    } else {
                        $this->warn("Failed to download {$filename}: HTTP status " . $response->status() . " (Attempt {$attempt})");
                    }
                } catch (\Exception $e) {
                    $this->error("Error downloading {$filename}: " . $e->getMessage() . " (Attempt {$attempt})");
                    
                    if ($attempt < $maxRetries) {
                        $this->info("Retrying in 2 seconds...");
                        sleep(2); // Wait before retrying
                    }
                }
            }
            
            if (!$success) {
                $this->error("Failed to download {$filename} after {$maxRetries} attempts");
                
                // Copy a local default image if available
                if (file_exists(public_path('assets/images/classes/default.jpg'))) {
                    $defaultContent = file_get_contents(public_path('assets/images/classes/default.jpg'));
                    Storage::put($path, $defaultContent);
                    $this->info("Using local default image for {$filename}");
                }
            }
            
            $this->output->progressAdvance();
            
            // Add a small delay to avoid rate limiting
            sleep(1);
        }
        
        $this->output->progressFinish();
        $this->info("Total images downloaded: {$downloaded}");
        
        // Create or update a default.jpg if it doesn't exist
        if (!Storage::exists("{$storagePath}/default.jpg") || $this->option('force')) {
            $this->info("Ensuring default image is available");
            try {
                // Try to download the default image one more time if needed
                $defaultUrl = $this->defaultImages['default.jpg'];
                $response = Http::withHeaders([
                    'User-Agent' => 'IQRAPATH/1.0 (edu-platform; subscription-plan-images)',
                ])->timeout(15)->get($defaultUrl);
                
                if ($response->successful()) {
                    Storage::put("{$storagePath}/default.jpg", $response->body());
                    $this->info("Default image downloaded successfully");
                }
            } catch (\Exception $e) {
                $this->error("Failed to download default image: " . $e->getMessage());
            }
        }
        
        // Show storage link reminder
        $this->info("Don't forget to run 'php artisan storage:link' if you haven't already");
        
        return 0;
    }
} 