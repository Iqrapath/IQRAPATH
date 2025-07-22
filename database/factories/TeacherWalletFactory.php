<?php

namespace Database\Factories;

use App\Models\TeacherWallet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherWallet>
 */
class TeacherWalletFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TeacherWallet::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'balance' => $this->faker->randomFloat(2, 0, 5000),
            'currency' => $this->faker->randomElement(['NGN', 'USD', 'GBP', 'EUR']),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the wallet is inactive.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_active' => false,
            ];
        });
    }

    /**
     * Indicate that the wallet has zero balance.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function empty()
    {
        return $this->state(function (array $attributes) {
            return [
                'balance' => 0,
            ];
        });
    }
} 