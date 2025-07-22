<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create subscription plans
        $this->createSubscriptionPlans();

        // Get student users
        $students = User::where('role', 'student')->get();

        if ($students->isEmpty()) {
            // If no students exist, create some
            $students = User::factory()->student()->count(30)->create();
        }

        // Create subscriptions and payments for each student
        foreach ($students as $student) {
            $this->createSubscriptionsForStudent($student);
        }

        // Generate recurring payments for active subscriptions
        $this->generateRecurringPayments();
    }

    /**
     * Create predefined subscription plans
     */
    private function createSubscriptionPlans(): void
    {
        $plans = [
            [
                'name' => "Juz' Amma - ₦10,000/month",
                'price' => 10000.00,
                'description' => "Learn and memorize Juz' Amma (30th part of the Quran). Ideal for beginners. Includes 2 sessions per week with qualified teachers who specialize in Quran memorization.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Half Quran - ₦15,000/month",
                'price' => 15000.00,
                'description' => "Comprehensive program covering half of the Quran with Tajweed rules and memorization techniques. Includes 3 sessions per week with advanced teachers.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Full Quran - ₦25,000/month",
                'price' => 25000.00,
                'description' => "Complete Quran program including Tajweed, memorization, and understanding of meanings. Includes 4 sessions per week with expert teachers and personalized learning plan.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Tajweed Basics - ₦8,000/month",
                'price' => 8000.00,
                'description' => "Focus on proper Quranic pronunciation and Tajweed rules for beginners. Includes weekly sessions with Tajweed specialists and interactive learning resources.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Advanced Tajweed - ₦12,000/month",
                'price' => 12000.00,
                'description' => "Advanced Tajweed course for students who already know the basics. Includes 2 sessions per week with certified Tajweed masters and detailed assessment of recitation.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Juz' Amma Annual - ₦100,000/year",
                'price' => 100000.00,
                'description' => "Annual subscription for Juz' Amma program with 16% discount. Includes 2 sessions per week with qualified teachers, progress tracking, and certification upon completion.",
                'billing_period' => 'year',
                'is_active' => true,
            ],
            [
                'name' => "Full Quran Annual - ₦250,000/year",
                'price' => 250000.00,
                'description' => "Annual subscription for Full Quran program with 16% discount. Includes 4 sessions per week with expert teachers, comprehensive progress tracking, and formal certification.",
                'billing_period' => 'year',
                'is_active' => true,
            ],
            [
                'name' => "Islamic Studies - ₦9,000/month",
                'price' => 9000.00,
                'description' => "Comprehensive Islamic Studies program covering Aqeedah, Fiqh, and Seerah. Includes weekly sessions with knowledgeable scholars and interactive learning materials.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => "Quranic Arabic - ₦12,000/month",
                'price' => 12000.00,
                'description' => "Learn Quranic Arabic to understand the Quran in its original language. Includes 2 sessions per week with Arabic language specialists and structured learning path.",
                'billing_period' => 'month',
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::firstOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }

    /**
     * Create realistic subscription history for a student
     */
    private function createSubscriptionsForStudent(User $student): void
    {
        // Determine how many subscriptions the student has had (1-3)
        $subscriptionCount = rand(1, 3);

        // Get all plans with appropriate limits by student age/level
        $plans = SubscriptionPlan::all();
        
        // If student is a child, prefer beginner plans
        if ($student->studentProfile && $student->studentProfile->age_group === 'child') {
            $preferredPlans = $plans->filter(function($plan) {
                return stripos($plan->name, 'juz') !== false || 
                       stripos($plan->name, 'amma') !== false || 
                       stripos($plan->name, 'basic') !== false;
            });
            
            if ($preferredPlans->count() > 0) {
                $plans = $preferredPlans;
            }
        }
        
        // Convert to array for random selection
        $plansArray = $plans->toArray();

        // Randomly select a current/latest plan
        $currentPlanData = $plansArray[array_rand($plansArray)];
        $currentPlan = SubscriptionPlan::find($currentPlanData['id']);

        // Create the current active subscription
        $startDate = Carbon::now()->subDays(rand(1, 90)); // Started within the last 3 months

        // Set end date based on billing period
        $endDate = ($currentPlan->billing_period === 'month')
            ? (clone $startDate)->addMonths(rand(1, 6)) // 1-6 month subscription
            : (clone $startDate)->addYear(); // 1 year subscription

        // Ensure some subscriptions extend into the future
        if (rand(1, 100) > 30) { // 70% chance that subscription is still active
            $endDate = max($endDate, Carbon::now()->addDays(rand(14, 180))); // At least 2 weeks into the future
        }

        // Create the current subscription
        $currentSubscription = Subscription::create([
            'user_id' => $student->id,
            'subscription_plan_id' => $currentPlan->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => Carbon::now()->between($startDate, $endDate) ? 'active' : 'pending',
            'notes' => rand(1, 100) > 70 ? fake()->sentence(10) : null,
        ]);

        // Create initial payment for current subscription
        $this->createPaymentForSubscription($currentSubscription, $startDate);

        // If the student has had more than one subscription, create past subscriptions
        if ($subscriptionCount > 1) {
            for ($i = 1; $i < $subscriptionCount; $i++) {
                // Pick a different plan for past subscriptions
                $pastPlanData = $plansArray[array_rand($plansArray)];
                while ($pastPlanData['id'] === $currentPlan->id) {
                    $pastPlanData = $plansArray[array_rand($plansArray)];
                }
                $pastPlan = SubscriptionPlan::find($pastPlanData['id']);

                // Set dates for past subscription - ended before current one started
                $pastEndDate = (clone $startDate)->subDays(rand(1, 30));
                $pastStartDate = ($pastPlan->billing_period === 'month')
                    ? (clone $pastEndDate)->subMonths(rand(1, 6))
                    : (clone $pastEndDate)->subYear();

                // Create the past subscription
                $pastSubscription = Subscription::create([
                    'user_id' => $student->id,
                    'subscription_plan_id' => $pastPlan->id,
                    'start_date' => $pastStartDate,
                    'end_date' => $pastEndDate,
                    'status' => 'expired',
                    'notes' => rand(1, 100) > 70 ? fake()->sentence(10) : null,
                ]);

                // Create payment(s) for past subscription
                $this->createPaymentForSubscription($pastSubscription, $pastStartDate);
            }
        }
    }

    /**
     * Create payment(s) for a subscription
     */
    private function createPaymentForSubscription(Subscription $subscription, Carbon $firstPaymentDate): void
    {
        // Create initial payment
        SubscriptionPayment::create([
            'subscription_id' => $subscription->id,
            'user_id' => $subscription->user_id,
            'amount' => $subscription->plan->price,
            'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'cash', 'paypal', 'flutterwave']),
            'transaction_id' => strtoupper(fake()->bothify('???-####-####')),
            'status' => 'completed',
            'payment_date' => $firstPaymentDate,
            'notes' => rand(1, 100) > 80 ? fake()->sentence(6) : null,
        ]);

        // For monthly subscriptions that have been active for multiple months,
        // create additional monthly payments
        if ($subscription->plan->billing_period === 'month') {
            $currentDate = Carbon::now();
            $paymentDate = (clone $firstPaymentDate)->addMonth();

            // Add monthly payments up to current date or end date (whichever is earlier)
            $endLimit = min($currentDate, $subscription->end_date);

            while ($paymentDate->lt($endLimit)) {
                // 90% chance of payment being completed, 10% chance of being pending/failed
                $paymentStatus = rand(1, 100) > 10 ? 'completed' : fake()->randomElement(['pending', 'failed']);

                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'amount' => $subscription->plan->price,
                    'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'cash', 'paypal', 'flutterwave']),
                    'transaction_id' => strtoupper(fake()->bothify('???-####-####')),
                    'status' => $paymentStatus,
                    'payment_date' => $paymentDate,
                    'notes' => rand(1, 100) > 80 ? fake()->sentence(6) : null,
                ]);

                $paymentDate = (clone $paymentDate)->addMonth();
            }
        }
    }

    /**
     * Generate recurring payments for all active subscriptions to fill the revenue chart
     */
    private function generateRecurringPayments(): void
    {
        // Get all active subscriptions
        $activeSubscriptions = Subscription::where('status', 'active')->get();

        // Define the range for the revenue chart (last 12 months)
        $startDate = Carbon::now()->subYear()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        // For each month in the range
        $currentMonth = (clone $startDate);

        while ($currentMonth->lt($endDate)) {
            // Calculate how many payments to generate this month (20-30)
            $paymentsToGenerate = rand(20, 30);

            // Get subscriptions active during this month
            $monthStart = (clone $currentMonth)->startOfMonth();
            $monthEnd = (clone $currentMonth)->endOfMonth();

            // Generate payments for this month
            for ($i = 0; $i < $paymentsToGenerate; $i++) {
                // Pick a random subscription, or create one if needed
                if ($activeSubscriptions->count() > 0) {
                    $subscription = $activeSubscriptions->random();
                } else {
                    $subscription = Subscription::factory()->active()->create();
                    $activeSubscriptions->push($subscription);
                }

                // Generate a random payment date within the month
                $paymentDate = Carbon::create(
                    $currentMonth->year,
                    $currentMonth->month,
                    rand(1, $currentMonth->daysInMonth),
                    rand(9, 17), // Between 9 AM and 5 PM
                    rand(0, 59)
                );

                // Create the payment
                SubscriptionPayment::create([
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'amount' => $subscription->plan->price,
                    'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'cash', 'paypal', 'flutterwave']),
                    'transaction_id' => strtoupper(fake()->bothify('???-####-####')),
                    'status' => 'completed',
                    'payment_date' => $paymentDate,
                    'notes' => null,
                ]);
            }

            // Move to next month
            $currentMonth->addMonth();
        }
    }
}
