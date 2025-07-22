<?php

namespace Database\Factories;

use App\Models\Subscription;
use App\Models\User;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class SubscriptionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Subscription::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 year', 'now');
        $isMonthly = fake()->boolean(80); // 80% monthly plans, 20% yearly

        // Create end date based on billing period
        if ($isMonthly) {
            $endDate = (clone $startDate)->modify('+1 month');
            // Some subscriptions might be extended for multiple months
            if (fake()->boolean(30)) {
                $endDate = (clone $startDate)->modify('+' . fake()->numberBetween(3, 6) . ' months');
            }
        } else {
            $endDate = (clone $startDate)->modify('+1 year');
        }

        // Create a student
        $student = User::factory()->student()->create();
        
        // Get a plan based on billing period
        $plan = $isMonthly ? 
            SubscriptionPlan::factory()->monthly()->create() : 
            SubscriptionPlan::factory()->yearly()->create();

        return [
            'user_id' => $student->id,
            'subscription_plan_id' => $plan->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive', 'pending', 'cancelled', 'expired']), // Weighted towards active
            'notes' => fake()->boolean(30) ? fake()->sentence(10) : null,
        ];
    }

    /**
     * Configure the subscription as active
     */
    public function active(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = Carbon::now()->subDays(rand(1, 60));
            $endDate = Carbon::now()->addDays(rand(30, 180));
            
            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active',
            ];
        });
    }

    /**
     * Configure the subscription as expired
     */
    public function expired(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = fake()->dateTimeBetween('-2 years', '-13 months');
            $endDate = (clone $startDate)->modify('+1 year');

            return [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'expired',
            ];
        });
    }

    /**
     * Configure the subscription for a child
     */
    public function forChild(): static
    {
        return $this->state(function (array $attributes) {
            // Get a beginner plan appropriate for children
            $plan = SubscriptionPlan::factory()->forBeginners()->create();
            
            return [
                'subscription_plan_id' => $plan->id,
            ];
        });
    }
    
    /**
     * Configure the subscription for a teen/adult
     */
    public function forAdvancedStudent(): static
    {
        return $this->state(function (array $attributes) {
            // Get an advanced plan
            $plan = SubscriptionPlan::factory()->forAdvanced()->create();
            
            return [
                'subscription_plan_id' => $plan->id,
            ];
        });
    }

    /**
     * Configure the subscription with a specified user
     */
    public function forUser(User $user): static
    {
        return $this->state(function (array $attributes) use ($user) {
            // Select a plan based on the user's profile if it exists
            $planId = $attributes['subscription_plan_id'] ?? null;
            
            if (!$planId && $user->role === 'student' && $user->studentProfile) {
                if ($user->studentProfile->age_group === 'child') {
                    $plan = SubscriptionPlan::factory()->forBeginners()->create();
                    $planId = $plan->id;
                } elseif (in_array($user->studentProfile->age_group, ['teenager', 'adult'])) {
                    // Teens and adults more likely to have advanced plans
                    $isAdvanced = fake()->boolean(70);
                    $plan = $isAdvanced ? 
                        SubscriptionPlan::factory()->forAdvanced()->create() : 
                        SubscriptionPlan::factory()->forBeginners()->create();
                    $planId = $plan->id;
                }
            }
            
            return [
                'user_id' => $user->id,
                'subscription_plan_id' => $planId,
            ];
        });
    }

    /**
     * Configure the subscription with a specified plan
     */
    public function withPlan(SubscriptionPlan $plan): static
    {
        return $this->state(function (array $attributes) use ($plan) {
            // Adjust end date based on plan's billing period
            $startDate = $attributes['start_date'] ?? now();
            $endDate = $plan->billing_period === 'month'
                ? (clone $startDate)->modify('+1 month')
                : (clone $startDate)->modify('+1 year');

            return [
                'subscription_plan_id' => $plan->id,
                'end_date' => $endDate,
            ];
        });
    }
}
