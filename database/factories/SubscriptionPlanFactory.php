<?php

namespace Database\Factories;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionPlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SubscriptionPlan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plans = [
            [
                'name' => "Juz' Amma - ₦10,000/month",
                'price' => 10000.00,
                'description' => "Learn and memorize Juz' Amma (30th part of the Quran). Ideal for beginners. Includes 2 sessions per week with qualified teachers who specialize in Quran memorization.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/juz-amma.jpg',
            ],
            [
                'name' => "Half Quran - ₦15,000/month",
                'price' => 15000.00,
                'description' => "Comprehensive program covering half of the Quran with Tajweed rules and memorization techniques. Includes 3 sessions per week with advanced teachers.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/half-quran.jpg',
            ],
            [
                'name' => "Full Quran - ₦25,000/month",
                'price' => 25000.00,
                'description' => "Complete Quran program including Tajweed, memorization, and understanding of meanings. Includes 4 sessions per week with expert teachers and personalized learning plan.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/full-quran.jpg',
            ],
            [
                'name' => "Tajweed Basics - ₦8,000/month",
                'price' => 8000.00,
                'description' => "Focus on proper Quranic pronunciation and Tajweed rules for beginners. Includes weekly sessions with Tajweed specialists and interactive learning resources.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/tajweed-basics.jpg',
            ],
            [
                'name' => "Advanced Tajweed - ₦12,000/month",
                'price' => 12000.00,
                'description' => "Advanced Tajweed course for students who already know the basics. Includes 2 sessions per week with certified Tajweed masters and detailed assessment of recitation.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/advanced-tajweed.jpg',
            ],
            [
                'name' => "Juz' Amma Annual - ₦100,000/year",
                'price' => 100000.00,
                'description' => "Annual subscription for Juz' Amma program with 16% discount. Includes 2 sessions per week with qualified teachers, progress tracking, and certification upon completion.",
                'billing_period' => 'year',
                'is_active' => true,
                'image' => '/assets/images/classes/juz-amma-annual.jpg',
            ],
            [
                'name' => "Full Quran Annual - ₦250,000/year",
                'price' => 250000.00,
                'description' => "Annual subscription for Full Quran program with 16% discount. Includes 4 sessions per week with expert teachers, comprehensive progress tracking, and formal certification.",
                'billing_period' => 'year',
                'is_active' => true,
                'image' => '/assets/images/classes/full-quran-annual.jpg',
            ],
            [
                'name' => "Islamic Studies - ₦9,000/month",
                'price' => 9000.00,
                'description' => "Comprehensive Islamic Studies program covering Aqeedah, Fiqh, and Seerah. Includes weekly sessions with knowledgeable scholars and interactive learning materials.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/islamic-studies.jpg',
            ],
            [
                'name' => "Quranic Arabic - ₦12,000/month",
                'price' => 12000.00,
                'description' => "Learn Quranic Arabic to understand the Quran in its original language. Includes 2 sessions per week with Arabic language specialists and structured learning path.",
                'billing_period' => 'month',
                'is_active' => true,
                'image' => '/assets/images/classes/quranic-arabic.jpg',
            ],
        ];

        return $plans[array_rand($plans)];
    }

    /**
     * Configure the plan as monthly
     */
    public function monthly(): static
    {
        return $this->state(function (array $attributes) {
            $monthlyPlans = [
                [
                    'name' => "Juz' Amma - ₦10,000/month",
                    'price' => 10000.00,
                    'description' => "Learn and memorize Juz' Amma (30th part of the Quran). Ideal for beginners. Includes 2 sessions per week with qualified teachers who specialize in Quran memorization.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/juz-amma.jpg',
                ],
                [
                    'name' => "Half Quran - ₦15,000/month",
                    'price' => 15000.00,
                    'description' => "Comprehensive program covering half of the Quran with Tajweed rules and memorization techniques. Includes 3 sessions per week with advanced teachers.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/half-quran.jpg',
                ],
                [
                    'name' => "Tajweed Basics - ₦8,000/month",
                    'price' => 8000.00,
                    'description' => "Focus on proper Quranic pronunciation and Tajweed rules for beginners. Includes weekly sessions with Tajweed specialists and interactive learning resources.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/tajweed-basics.jpg',
                ],
                [
                    'name' => "Islamic Studies - ₦9,000/month",
                    'price' => 9000.00,
                    'description' => "Comprehensive Islamic Studies program covering Aqeedah, Fiqh, and Seerah. Includes weekly sessions with knowledgeable scholars and interactive learning materials.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/islamic-studies.jpg',
                ],
            ];
            
            return $monthlyPlans[array_rand($monthlyPlans)];
        });
    }

    /**
     * Configure the plan as yearly
     */
    public function yearly(): static
    {
        return $this->state(function (array $attributes) {
            $yearlyPlans = [
                [
                    'name' => "Juz' Amma Annual - ₦100,000/year",
                    'price' => 100000.00,
                    'description' => "Annual subscription for Juz' Amma program with 16% discount. Includes 2 sessions per week with qualified teachers, progress tracking, and certification upon completion.",
                    'billing_period' => 'year',
                    'is_active' => true,
                    'image' => '/assets/images/classes/juz-amma-annual.jpg',
                ],
                [
                    'name' => "Full Quran Annual - ₦250,000/year",
                    'price' => 250000.00,
                    'description' => "Annual subscription for Full Quran program with 16% discount. Includes 4 sessions per week with expert teachers, comprehensive progress tracking, and formal certification.",
                    'billing_period' => 'year',
                    'is_active' => true,
                    'image' => '/assets/images/classes/full-quran-annual.jpg',
                ],
            ];
            
            return $yearlyPlans[array_rand($yearlyPlans)];
        });
    }

    /**
     * Configure specific plan types
     */
    public function forBeginners(): static
    {
        return $this->state(function (array $attributes) {
            $beginnerPlans = [
                [
                    'name' => "Juz' Amma - ₦10,000/month",
                    'price' => 10000.00,
                    'description' => "Learn and memorize Juz' Amma (30th part of the Quran). Ideal for beginners. Includes 2 sessions per week with qualified teachers who specialize in Quran memorization.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/juz-amma.jpg',
                ],
                [
                    'name' => "Tajweed Basics - ₦8,000/month",
                    'price' => 8000.00,
                    'description' => "Focus on proper Quranic pronunciation and Tajweed rules for beginners. Includes weekly sessions with Tajweed specialists and interactive learning resources.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/tajweed-basics.jpg',
                ],
            ];
            
            return $beginnerPlans[array_rand($beginnerPlans)];
        });
    }

    public function forAdvanced(): static
    {
        return $this->state(function (array $attributes) {
            $advancedPlans = [
                [
                    'name' => "Full Quran - ₦25,000/month",
                    'price' => 25000.00,
                    'description' => "Complete Quran program including Tajweed, memorization, and understanding of meanings. Includes 4 sessions per week with expert teachers and personalized learning plan.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/full-quran.jpg',
                ],
                [
                    'name' => "Advanced Tajweed - ₦12,000/month",
                    'price' => 12000.00,
                    'description' => "Advanced Tajweed course for students who already know the basics. Includes 2 sessions per week with certified Tajweed masters and detailed assessment of recitation.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/advanced-tajweed.jpg',
                ],
                [
                    'name' => "Quranic Arabic - ₦12,000/month",
                    'price' => 12000.00,
                    'description' => "Learn Quranic Arabic to understand the Quran in its original language. Includes 2 sessions per week with Arabic language specialists and structured learning path.",
                    'billing_period' => 'month',
                    'is_active' => true,
                    'image' => '/assets/images/classes/quranic-arabic.jpg',
                ],
            ];
            
            return $advancedPlans[array_rand($advancedPlans)];
        });
    }
}
