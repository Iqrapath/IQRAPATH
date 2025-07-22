<?php

namespace App\Console\Commands;

use App\Models\SubscriptionPlan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DownloadSubscriptionPlanImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:download-images {--force : Force re-download even if images already exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download subscription plan images from external APIs and assign them to plans';

    /**
     * Image search keywords for each plan type
     */
    protected $planKeywords = [
        "Juz' Amma" => ['quran', 'learning', 'muslim', 'education'],
        "Half Quran" => ['quran', 'memorization', 'study', 'islamic'],
        "Full Quran" => ['quran', 'complete', 'recitation', 'holy'],
        "Tajweed Basics" => ['tajweed', 'pronunciation', 'quran', 'learning'],
        "Advanced Tajweed" => ['quran', 'recitation', 'advanced', 'teaching'],
        "Islamic Studies" => ['islamic', 'education', 'studies', 'scholar'],
        "Quranic Arabic" => ['arabic', 'language', 'writing', 'quran'],
    ];

    /**
     * Unsplash API credentials (need to be configured)
     */
    protected $unsplashAccessKey;

    /**
     * Pexels API credentials (need to be configured)
     */
    protected $pexelsApiKey;

    /**
     * Constructor to set API keys
     */
    public function __construct()
    {
        parent::__construct();
        $this->unsplashAccessKey = config('services.unsplash.access_key');
        $this->pexelsApiKey = config('services.pexels.api_key');
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Downloading subscription plan images...');
        
        // Check if API keys are configured
        if (!$this->unsplashAccessKey && !$this->pexelsApiKey) {
            $this->error('No API keys configured for image sources. Check .env file.');
            $this->info('You can set UNSPLASH_ACCESS_KEY or PEXELS_API_KEY in your .env file');
            return 1;
        }
        
        // Create storage directory if it doesn't exist
        $storagePath = 'public/assets/images/classes';
        if (!Storage::exists($storagePath)) {
            Storage::makeDirectory($storagePath);
            $this->info("Created directory: {$storagePath}");
        }
        
        $plans = SubscriptionPlan::all();
        $updated = 0;
        
        $this->output->progressStart($plans->count());
        
        foreach ($plans as $plan) {
            // Determine search keywords based on plan name
            $keywords = $this->getSearchKeywordsForPlan($plan);
            
            // Skip if plan already has an image and --force is not used
            if ($plan->image && !$this->option('force')) {
                $this->output->progressAdvance();
                continue;
            }
            
            // Try to download an image
            $imagePath = $this->downloadImageForPlan($plan, $keywords);
            
            if ($imagePath) {
                $plan->image = $imagePath;
                $plan->save();
                $updated++;
            } else {
                $this->warn("Could not find image for plan: {$plan->name}");
                
                // Use default image if download failed
                if (!$plan->image) {
                    $plan->image = '/assets/images/classes/default.jpg';
                    $plan->save();
                }
            }
            
            $this->output->progressAdvance();
        }
        
        $this->output->progressFinish();
        $this->info("Total plans updated with new images: {$updated}");
        
        return 0;
    }
    
    /**
     * Get search keywords for a specific plan
     */
    protected function getSearchKeywordsForPlan(SubscriptionPlan $plan): array
    {
        foreach ($this->planKeywords as $planType => $keywords) {
            if (Str::contains($plan->name, $planType)) {
                return $keywords;
            }
        }
        
        // Default keywords if no specific match found
        return ['quran', 'education', 'islamic'];
    }
    
    /**
     * Download image from API based on keywords
     */
    protected function downloadImageForPlan(SubscriptionPlan $plan, array $keywords): ?string
    {
        // Try Unsplash API first if configured
        if ($this->unsplashAccessKey) {
            $imagePath = $this->downloadFromUnsplash($plan, $keywords);
            if ($imagePath) return $imagePath;
        }
        
        // Try Pexels API if configured and Unsplash failed
        if ($this->pexelsApiKey) {
            $imagePath = $this->downloadFromPexels($plan, $keywords);
            if ($imagePath) return $imagePath;
        }
        
        return null;
    }
    
    /**
     * Download image from Unsplash API
     */
    protected function downloadFromUnsplash(SubscriptionPlan $plan, array $keywords): ?string
    {
        $this->info("Searching Unsplash for: " . implode(', ', $keywords));
        
        $keyword = implode(' ', $keywords);
        $response = Http::withHeaders([
                'Authorization' => "Client-ID {$this->unsplashAccessKey}"
            ])
            ->get('https://api.unsplash.com/search/photos', [
                'query' => $keyword,
                'per_page' => 1,
                'orientation' => 'landscape',
            ]);
        
        if ($response->successful() && isset($response['results'][0])) {
            $imageUrl = $response['results'][0]['urls']['regular'];
            return $this->saveImageFromUrl($imageUrl, $plan);
        }
        
        return null;
    }
    
    /**
     * Download image from Pexels API
     */
    protected function downloadFromPexels(SubscriptionPlan $plan, array $keywords): ?string
    {
        $this->info("Searching Pexels for: " . implode(', ', $keywords));
        
        $keyword = implode(' ', $keywords);
        $response = Http::withHeaders([
                'Authorization' => $this->pexelsApiKey
            ])
            ->get('https://api.pexels.com/v1/search', [
                'query' => $keyword,
                'per_page' => 1,
            ]);
        
        if ($response->successful() && isset($response['photos'][0])) {
            $imageUrl = $response['photos'][0]['src']['large'];
            return $this->saveImageFromUrl($imageUrl, $plan);
        }
        
        return null;
    }
    
    /**
     * Save image from URL to storage
     */
    protected function saveImageFromUrl(string $url, SubscriptionPlan $plan): ?string
    {
        try {
            $imageContents = file_get_contents($url);
            
            if (!$imageContents) {
                return null;
            }
            
            // Generate a filename based on plan name
            $filename = Str::slug(str_replace('/', '-', $plan->name)) . '.jpg';
            $storagePath = 'assets/images/classes/' . $filename;
            $fullPath = 'public/' . $storagePath;
            
            // Save file to storage
            Storage::put($fullPath, $imageContents);
            $this->info("Downloaded image for: {$plan->name}");
            
            // Return the public path
            return '/' . $storagePath;
        } catch (\Exception $e) {
            $this->error("Error downloading image: " . $e->getMessage());
            return null;
        }
    }
} 