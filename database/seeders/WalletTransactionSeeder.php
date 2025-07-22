<?php

namespace Database\Seeders;

use App\Models\TeacherWallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class WalletTransactionSeeder extends Seeder
{
    /**
     * Seed the wallet transactions table.
     */
    public function run(): void
    {
        // Get all teacher wallets
        $wallets = TeacherWallet::all();

        foreach ($wallets as $wallet) {
            // Create 5-15 transactions for each wallet
            $transactionCount = rand(5, 15);
            
            // Start with zero balance
            $balance = 0;
            
            for ($i = 0; $i < $transactionCount; $i++) {
                // Determine if this is a credit or debit transaction
                // More credits than debits to ensure positive balance
                $isCredit = rand(0, 100) < 70;
                
                if ($isCredit) {
                    // Create a credit transaction
                    $amount = $this->faker()->randomFloat(2, 20, 200);
                    $balanceBefore = $balance;
                    $balance += $amount;
                    
                    WalletTransaction::factory()->create([
                        'wallet_id' => $wallet->id,
                        'amount' => $amount,
                        'balance_before' => $balanceBefore,
                        'balance_after' => $balance,
                        'type' => 'credit',
                        'status' => 'completed',
                        'description' => $this->getRandomCreditDescription(),
                        'reference' => $this->faker()->uuid(),
                        'metadata' => [
                            'source' => $this->faker()->randomElement(['session_payment', 'manual_credit', 'refund']),
                            'session_id' => $this->faker()->numberBetween(1, 100),
                        ],
                    ]);
                } else {
                    // Only create debit if there's enough balance
                    if ($balance > 50) {
                        $amount = $this->faker()->randomFloat(2, 10, min(100, $balance * 0.8));
                        $balanceBefore = $balance;
                        $balance -= $amount;
                        
                        WalletTransaction::factory()->create([
                            'wallet_id' => $wallet->id,
                            'amount' => $amount,
                            'balance_before' => $balanceBefore,
                            'balance_after' => $balance,
                            'type' => 'debit',
                            'status' => 'completed',
                            'description' => $this->getRandomDebitDescription(),
                            'reference' => $this->faker()->uuid(),
                            'metadata' => [
                                'source' => $this->faker()->randomElement(['payout', 'fee', 'adjustment']),
                            ],
                        ]);
                    }
                }
            }
            
            // Update the wallet balance to match the final balance
            $wallet->balance = $balance;
            $wallet->save();
        }
    }

    /**
     * Get a faker instance.
     */
    private function faker()
    {
        return \Faker\Factory::create();
    }

    /**
     * Get a random credit transaction description.
     */
    private function getRandomCreditDescription()
    {
        $descriptions = [
            'Payment for teaching session #',
            'Bonus for excellent rating',
            'Referral reward',
            'Compensation for cancelled session',
            'Monthly performance bonus',
        ];

        $description = $descriptions[array_rand($descriptions)];
        
        if (strpos($description, '#') !== false) {
            $description .= $this->faker()->numberBetween(1000, 9999);
        }

        return $description;
    }

    /**
     * Get a random debit transaction description.
     */
    private function getRandomDebitDescription()
    {
        $descriptions = [
            'Payout request #',
            'Platform fee',
            'Adjustment for cancelled session',
            'Withdrawal to bank account',
            'Withdrawal to PayPal',
        ];

        $description = $descriptions[array_rand($descriptions)];
        
        if (strpos($description, '#') !== false) {
            $description .= $this->faker()->numberBetween(1000, 9999);
        }

        return $description;
    }
} 