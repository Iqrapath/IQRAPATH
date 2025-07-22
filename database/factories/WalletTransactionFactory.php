<?php

namespace Database\Factories;

use App\Models\TeacherWallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WalletTransaction>
 */
class WalletTransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = WalletTransaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 10, 500);
        $balanceBefore = $this->faker->randomFloat(2, 100, 2000);
        $type = $this->faker->randomElement(['credit', 'debit']);
        $balanceAfter = $type === 'credit' ? $balanceBefore + $amount : $balanceBefore - $amount;

        return [
            'wallet_id' => TeacherWallet::factory(),
            'amount' => $amount,
            'balance_before' => $balanceBefore,
            'balance_after' => $balanceAfter,
            'type' => $type,
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'reversed']),
            'description' => $this->faker->sentence(),
            'reference' => $this->faker->uuid(),
            'metadata' => [
                'source' => $this->faker->randomElement(['session_payment', 'manual_credit', 'payout', 'refund']),
                'session_id' => $type === 'credit' ? $this->faker->numberBetween(1, 100) : null,
            ],
        ];
    }

    /**
     * Indicate that the transaction is a credit.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function credit()
    {
        return $this->state(function (array $attributes) {
            $amount = $attributes['amount'] ?? $this->faker->randomFloat(2, 10, 500);
            $balanceBefore = $attributes['balance_before'] ?? $this->faker->randomFloat(2, 100, 2000);
            
            return [
                'type' => 'credit',
                'balance_after' => $balanceBefore + $amount,
                'description' => 'Credit: ' . $this->faker->sentence(),
                'metadata' => [
                    'source' => $this->faker->randomElement(['session_payment', 'manual_credit', 'refund']),
                    'session_id' => $this->faker->numberBetween(1, 100),
                ],
            ];
        });
    }

    /**
     * Indicate that the transaction is a debit.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function debit()
    {
        return $this->state(function (array $attributes) {
            $amount = $attributes['amount'] ?? $this->faker->randomFloat(2, 10, 500);
            $balanceBefore = $attributes['balance_before'] ?? $this->faker->randomFloat(2, 500, 2000);
            
            return [
                'type' => 'debit',
                'balance_after' => $balanceBefore - $amount,
                'description' => 'Debit: ' . $this->faker->sentence(),
                'metadata' => [
                    'source' => $this->faker->randomElement(['payout', 'fee', 'adjustment']),
                ],
            ];
        });
    }

    /**
     * Indicate that the transaction is completed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function completed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
            ];
        });
    }

    /**
     * Indicate that the transaction is pending.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
            ];
        });
    }
} 