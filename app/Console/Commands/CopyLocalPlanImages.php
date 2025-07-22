<?php

namespace App\Console\Commands;

use App\Models\SubscriptionPlan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CopyLocalPlanImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:copy-local-images {--force : Force copy even if images already exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copy local default images for subscription plans';

    /**
     * Image mapping for different plan types
     */
    protected $planImageMapping = [
        "Juz' Amma" => 'juz-amma.jpg',
        "Half Quran" => 'half-quran.jpg',
        "Full Quran" => 'full-quran.jpg',
        "Tajweed Basics" => 'tajweed-basics.jpg',
        "Advanced Tajweed" => 'advanced-tajweed.jpg',
        "Islamic Studies" => 'islamic-studies.jpg',
        "Quranic Arabic" => 'quranic-arabic.jpg',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Copying local subscription plan images...');
        
        // Check if source directory exists
        $sourcePath = public_path('assets/images/classes');
        if (!File::exists($sourcePath)) {
            $this->error("Source directory not found: {$sourcePath}");
            $this->info("Make sure you have images in your public/assets/images/classes directory");
            return 1;
        }
        
        // Create storage directory if it doesn't exist
        $storagePath = 'public/assets/images/classes';
        if (!Storage::exists($storagePath)) {
            Storage::makeDirectory($storagePath);
            $this->info("Created directory: {$storagePath}");
        }
        
        // List of files to copy (prioritizing these specific names)
        $imagesToCopy = [
            'juz-amma.jpg',
            'half-quran.jpg',
            'full-quran.jpg',
            'tajweed-basics.jpg',
            'advanced-tajweed.jpg',
            'islamic-studies.jpg',
            'quranic-arabic.jpg',
            'juz-amma-annual.jpg',
            'full-quran-annual.jpg',
            'default.jpg',
        ];
        
        // First, copy specific image files
        $copied = 0;
        $this->output->progressStart(count($imagesToCopy));
        
        foreach ($imagesToCopy as $filename) {
            $sourcefile = "{$sourcePath}/{$filename}";
            $destPath = "{$storagePath}/{$filename}";
            
            // Skip if destination exists and force option is not used
            if (Storage::exists($destPath) && !$this->option('force')) {
                $this->line("Skipping {$filename} (already exists in storage)");
                $this->output->progressAdvance();
                continue;
            }
            
            // Check if source file exists
            if (File::exists($sourcefile)) {
                // Get file contents and save to storage
                $contents = File::get($sourcefile);
                Storage::put($destPath, $contents);
                $copied++;
                
                $this->line("Copied {$filename} to storage");
            } else {
                $this->warn("Source file not found: {$filename}");
                
                // If a default image is available, use it instead
                if ($filename !== 'default.jpg' && File::exists("{$sourcePath}/default.jpg")) {
                    $defaultContents = File::get("{$sourcePath}/default.jpg");
                    Storage::put($destPath, $defaultContents);
                    $copied++;
                    
                    $this->line("Used default image for {$filename}");
                }
            }
            
            $this->output->progressAdvance();
        }
        
        $this->output->progressFinish();
        
        // Copy any additional image files from the classes directory
        $this->info("Looking for additional image files...");
        $additionalFiles = File::files($sourcePath);
        foreach ($additionalFiles as $file) {
            $filename = $file->getFilename();
            
            // Skip already processed files
            if (in_array($filename, $imagesToCopy)) {
                continue;
            }
            
            $destPath = "{$storagePath}/{$filename}";
            
            // Skip if destination exists and force option is not used
            if (Storage::exists($destPath) && !$this->option('force')) {
                continue;
            }
            
            // Copy to storage
            $contents = File::get($file->getPathname());
            Storage::put($destPath, $contents);
            $copied++;
            
            $this->line("Copied additional file: {$filename}");
        }
        
        // Update subscription plans with appropriate images
        $this->info("Updating subscription plans with image paths...");
        $plans = SubscriptionPlan::all();
        $updatedPlans = 0;
        
        foreach ($plans as $plan) {
            // Skip if plan already has an image and force option is not used
            if ($plan->image && !$this->option('force')) {
                continue;
            }
            
            $imagePath = null;
            
            // Find appropriate image based on plan name
            foreach ($this->planImageMapping as $keyword => $image) {
                if (strpos($plan->name, $keyword) !== false) {
                    $imagePath = "/assets/images/classes/{$image}";
                    break;
                }
            }
            
            // If no specific match, check if annual plan
            if (!$imagePath) {
                if (strpos(strtolower($plan->name), 'annual') !== false) {
                    if (strpos($plan->name, "Juz' Amma") !== false) {
                        $imagePath = "/assets/images/classes/juz-amma-annual.jpg";
                    } else if (strpos($plan->name, "Full Quran") !== false) {
                        $imagePath = "/assets/images/classes/full-quran-annual.jpg";
                    } else {
                        $imagePath = "/assets/images/classes/default.jpg";
                    }
                } else {
                    $imagePath = "/assets/images/classes/default.jpg";
                }
            }
            
            // Update plan if image path determined
            if ($imagePath) {
                $plan->image = $imagePath;
                $plan->save();
                $updatedPlans++;
                
                $this->line("Updated plan image: {$plan->name} → {$imagePath}");
            }
        }
        
        $this->info("Total files copied to storage: {$copied}");
        $this->info("Total plans updated: {$updatedPlans}");
        
        // Show storage link reminder
        $this->info("Don't forget to run 'php artisan storage:link' if you haven't already");
        
        return 0;
    }
} 