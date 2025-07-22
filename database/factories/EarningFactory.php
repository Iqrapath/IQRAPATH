<?php

namespace Database\Factories;

use App\Models\Earning;
use App\Models\TeachingSession;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Earning>
 */
class EarningFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Earning::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => 'teacher']),
            'teaching_session_id' => TeachingSession::factory(),
            'amount' => $this->faker->randomFloat(2, 20, 500),
            'currency' => $this->faker->randomElement(['NGN', 'USD', 'GBP', 'EUR']),
            'status' => $this->faker->randomElement(['pending', 'paid', 'cancelled']),
            'payout_date' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-1 month', '+1 month') : null,
            'transaction_id' => null, // Will be set in the seeder if status is 'paid'
        ];
    }

    /**
     * Indicate that the earning is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'payout_date' => null,
                'transaction_id' => null,
            ];
        });
    }

    /**
     * Indicate that the earning is paid.
     *
     * @param WalletTransaction|null $transaction
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function paid($transaction = null)
    {
        return $this->state(function (array $attributes) use ($transaction) {
            return [
                'status' => 'paid',
                'payout_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
                'transaction_id' => $transaction ? $transaction->id : WalletTransaction::factory()->credit()->completed()->create()->id,
            ];
        });
    }

    /**
     * Indicate that the earning is cancelled.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function cancelled()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'cancelled',
                'payout_date' => null,
                'transaction_id' => null,
            ];
        });
    }
} 