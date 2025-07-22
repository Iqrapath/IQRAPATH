<?php

namespace App\Console\Commands;

use App\Models\SubscriptionPlan;
use Illuminate\Console\Command;

class UpdateSubscriptionPlanImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plans:update-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing subscription plans with appropriate images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating subscription plan images...');
        
        $planImages = [
            "Juz' Amma" => '/assets/images/classes/juz-amma.jpg',
            "Half Quran" => '/assets/images/classes/half-quran.jpg',
            "Full Quran" => '/assets/images/classes/full-quran.jpg',
            "Tajweed Basics" => '/assets/images/classes/tajweed-basics.jpg',
            "Advanced Tajweed" => '/assets/images/classes/advanced-tajweed.jpg',
            "Islamic Studies" => '/assets/images/classes/islamic-studies.jpg',
            "Quranic Arabic" => '/assets/images/classes/quranic-arabic.jpg',
        ];
        
        $plans = SubscriptionPlan::all();
        $updated = 0;
        
        foreach ($plans as $plan) {
            foreach ($planImages as $keyword => $image) {
                if (strpos($plan->name, $keyword) !== false) {
                    $plan->image = $image;
                    $plan->save();
                    $updated++;
                    $this->info("Updated image for plan: {$plan->name}");
                    break;
                }
            }
            
            // If no specific image was found, use a default
            if (!$plan->image) {
                $plan->image = '/assets/images/classes/default.jpg';
                $plan->save();
                $updated++;
                $this->info("Set default image for plan: {$plan->name}");
            }
        }
        
        $this->info("Total plans updated: {$updated}");
        
        return 0;
    }
} 