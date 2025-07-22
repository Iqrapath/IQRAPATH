<?php

namespace Database\Seeders;

use App\Models\Earning;
use App\Models\TeachingSession;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class EarningSeeder extends Seeder
{
    /**
     * Seed the earnings table.
     */
    public function run(): void
    {
        // Get demo teacher
        $demoTeacher = User::where('email', 'teacher@iqrapath.com')->first();

        if ($demoTeacher) {
            // Get teaching sessions for the demo teacher
            $sessions = TeachingSession::where('teacher_id', $demoTeacher->id)
                ->whereNotIn('id', function($query) {
                    $query->select('teaching_session_id')
                        ->from('earnings')
                        ->whereNotNull('teaching_session_id');
                })
                ->take(10)
                ->get();

            // Create earnings for each session
            foreach ($sessions as $session) {
                $amount = $this->faker()->randomFloat(2, 20, 50);
                
                // 70% chance of being paid
                $isPaid = $this->faker()->boolean(70);
                
                if ($isPaid) {
                    // Create a wallet transaction for the payment
                    $wallet = $demoTeacher->teacherWallet;
                    
                    if ($wallet) {
                        $transaction = WalletTransaction::factory()->credit()->completed()->create([
                            'wallet_id' => $wallet->id,
                            'amount' => $amount,
                            'description' => 'Payment for teaching session #' . $session->id,
                            'metadata' => [
                                'source' => 'session_payment',
                                'session_id' => $session->id,
                            ],
                        ]);
                        
                        // Create a paid earning
                        Earning::factory()->paid($transaction)->create([
                            'user_id' => $demoTeacher->id,
                            'teaching_session_id' => $session->id,
                            'amount' => $amount,
                            'currency' => 'USD',
                        ]);
                    }
                } else {
                    // Create a pending earning
                    Earning::factory()->pending()->create([
                        'user_id' => $demoTeacher->id,
                        'teaching_session_id' => $session->id,
                        'amount' => $amount,
                        'currency' => 'USD',
                    ]);
                }
            }
        }

        // Get all teachers except demo teacher
        $teachers = User::where('role', 'teacher')
            ->where('email', '!=', 'teacher@iqrapath.com')
            ->get();

        // Create earnings for each teacher
        foreach ($teachers as $teacher) {
            // Get teaching sessions for this teacher
            $sessions = TeachingSession::where('teacher_id', $teacher->id)
                ->whereNotIn('id', function($query) {
                    $query->select('teaching_session_id')
                        ->from('earnings')
                        ->whereNotNull('teaching_session_id');
                })
                ->take(5)
                ->get();

            // Create earnings for each session
            foreach ($sessions as $session) {
                $amount = $this->faker()->randomFloat(2, 15, 100);
                $currency = $this->faker()->randomElement(['NGN', 'USD', 'GBP', 'EUR']);
                
                // 60% chance of being paid
                $isPaid = $this->faker()->boolean(60);
                
                if ($isPaid) {
                    // Create a wallet transaction for the payment
                    $wallet = $teacher->teacherWallet;
                    
                    if ($wallet) {
                        $transaction = WalletTransaction::factory()->credit()->completed()->create([
                            'wallet_id' => $wallet->id,
                            'amount' => $amount,
                            'description' => 'Payment for teaching session #' . $session->id,
                            'metadata' => [
                                'source' => 'session_payment',
                                'session_id' => $session->id,
                            ],
                        ]);
                        
                        // Create a paid earning
                        Earning::factory()->paid($transaction)->create([
                            'user_id' => $teacher->id,
                            'teaching_session_id' => $session->id,
                            'amount' => $amount,
                            'currency' => $currency,
                        ]);
                    }
                } else {
                    // Create a pending earning
                    Earning::factory()->pending()->create([
                        'user_id' => $teacher->id,
                        'teaching_session_id' => $session->id,
                        'amount' => $amount,
                        'currency' => $currency,
                    ]);
                }
            }
            
            // Create some additional earnings without sessions (e.g., bonuses)
            $bonusCount = $this->faker()->numberBetween(1, 3);
            
            for ($i = 0; $i < $bonusCount; $i++) {
                $amount = $this->faker()->randomFloat(2, 10, 50);
                $currency = $this->faker()->randomElement(['NGN', 'USD', 'GBP', 'EUR']);
                
                // Create a paid bonus earning
                $wallet = $teacher->teacherWallet;
                
                if ($wallet) {
                    $transaction = WalletTransaction::factory()->credit()->completed()->create([
                        'wallet_id' => $wallet->id,
                        'amount' => $amount,
                        'description' => 'Bonus payment',
                        'metadata' => [
                            'source' => 'bonus',
                        ],
                    ]);
                    
                    Earning::factory()->paid($transaction)->create([
                        'user_id' => $teacher->id,
                        'teaching_session_id' => null,
                        'amount' => $amount,
                        'currency' => $currency,
                    ]);
                }
            }
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