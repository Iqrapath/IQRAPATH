<?php

namespace Database\Factories;

use App\Models\Subscription;
use App\Models\User;
use App\Models\SubscriptionPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionPaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SubscriptionPayment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subscription = Subscription::inRandomOrder()->first();

        // If no subscription exists, create a subscription
        if (!$subscription) {
            $subscription = Subscription::factory()->create();
        }

        // Get the user from the subscription
        $user = User::find($subscription->user_id);

        // Generate a payment date within the subscription period
        $paymentDate = fake()->dateTimeBetween(
            $subscription->start_date,
            min($subscription->end_date, now())
        );

        // Generate an amount based on the subscription plan
        $subscriptionPlan = $subscription->plan;
        $amount = $subscriptionPlan->price;

        return [
            'subscription_id' => $subscription->id,
            'user_id' => $user->id,
            'amount' => $amount,
            'payment_method' => fake()->randomElement(['credit_card', 'bank_transfer', 'cash', 'paypal', 'flutterwave']),
            'transaction_id' => strtoupper(fake()->bothify('???-####-####')),
            'status' => fake()->randomElement(['completed', 'completed', 'completed', 'pending', 'failed']), // Weighted towards completed
            'payment_date' => $paymentDate,
            'notes' => fake()->boolean(20) ? fake()->sentence(10) : null,
        ];
    }

    /**
     * Configure the payment as completed
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
            ];
        });
    }

    /**
     * Configure the payment as failed
     */
    public function failed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'failed',
            ];
        });
    }

    /**
     * Configure the payment as pending
     */
    public function pending(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
            ];
        });
    }

    /**
     * Configure the payment for a specific subscription
     */
    public function forSubscription(Subscription $subscription): static
    {
        return $this->state(function (array $attributes) use ($subscription) {
            // Generate a payment date within the subscription period
            $paymentDate = fake()->dateTimeBetween(
                $subscription->start_date,
                min($subscription->end_date, now())
            );

            return [
                'subscription_id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'amount' => $subscription->plan->price,
                'payment_date' => $paymentDate,
            ];
        });
    }

    /**
     * Configure the payment with a specific amount
     */
    public function withAmount(float $amount): static
    {
        return $this->state(function (array $attributes) use ($amount) {
            return [
                'amount' => $amount,
            ];
        });
    }
}
