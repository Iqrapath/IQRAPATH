<?php

namespace Database\Factories;

use App\Models\PayoutRequest;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PayoutRequest>
 */
class PayoutRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PayoutRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $paymentMethods = [
            'bank_transfer' => [
                'bank_name' => $this->faker->company(),
                'account_name' => $this->faker->name(),
                'account_number' => $this->faker->numerify('##########'),
                'sort_code' => $this->faker->numerify('######'),
            ],
            'paypal' => [
                'email' => $this->faker->email(),
            ],
            'mobile_money' => [
                'provider' => $this->faker->randomElement(['MTN', 'Airtel', 'Vodafone']),
                'phone_number' => $this->faker->phoneNumber(),
                'account_name' => $this->faker->name(),
            ],
        ];

        $paymentMethod = $this->faker->randomElement(array_keys($paymentMethods));
        $paymentDetails = $paymentMethods[$paymentMethod];

        return [
            'user_id' => User::factory()->state(['role' => 'teacher']),
            'amount' => $this->faker->randomFloat(2, 100, 2000),
            'currency' => $this->faker->randomElement(['NGN', 'USD', 'GBP', 'EUR']),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'completed']),
            'payment_method' => $paymentMethod,
            'payment_details' => $paymentDetails,
            'processed_at' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'processed_by' => $this->faker->boolean(50) ? User::factory()->state(['role' => 'admin']) : null,
            'transaction_id' => null, // Will be set in the seeder if status is 'completed'
        ];
    }

    /**
     * Indicate that the payout request is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'processed_at' => null,
                'processed_by' => null,
                'transaction_id' => null,
            ];
        });
    }

    /**
     * Indicate that the payout request is approved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function approved()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
                'processed_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
                'processed_by' => User::factory()->state(['role' => 'admin']),
                'transaction_id' => null,
            ];
        });
    }

    /**
     * Indicate that the payout request is rejected.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function rejected()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'rejected',
                'processed_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
                'processed_by' => User::factory()->state(['role' => 'admin']),
                'transaction_id' => null,
            ];
        });
    }

    /**
     * Indicate that the payout request is completed.
     *
     * @param WalletTransaction|null $transaction
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function completed($transaction = null)
    {
        return $this->state(function (array $attributes) use ($transaction) {
            return [
                'status' => 'completed',
                'processed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
                'processed_by' => User::factory()->state(['role' => 'admin']),
                'transaction_id' => $transaction ? $transaction->id : WalletTransaction::factory()->debit()->completed()->create()->id,
            ];
        });
    }
} 