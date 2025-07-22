<?php

namespace Database\Seeders;

use App\Models\TeacherWallet;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeacherWalletSeeder extends Seeder
{
    /**
     * Seed the teacher wallets table.
     */
    public function run(): void
    {
        // Get demo teacher
        $demoTeacher = User::where('email', 'teacher@iqrapath.com')->first();

        if ($demoTeacher) {
            // Create wallet for demo teacher with a substantial balance
            TeacherWallet::factory()->create([
                'user_id' => $demoTeacher->id,
                'balance' => 1250.00,
                'currency' => 'USD',
                'is_active' => true,
            ]);
        }

        // Get all teachers without wallets
        $teachers = User::where('role', 'teacher')
            ->whereNotIn('id', function($query) {
                $query->select('user_id')
                    ->from('teacher_wallets');
            })
            ->get();

        // Create wallets for all teachers
        foreach ($teachers as $teacher) {
            // Create wallet with random balance
            TeacherWallet::factory()->create([
                'user_id' => $teacher->id,
                'balance' => $this->faker()->randomFloat(2, 0, 2000),
                'currency' => $this->faker()->randomElement(['NGN', 'USD', 'GBP', 'EUR']),
                'is_active' => true,
            ]);
        }
    }

    /**
     * Get a faker instance.
     */
    private function faker()
    {
        return \Faker\Factory::create();
    }
} 