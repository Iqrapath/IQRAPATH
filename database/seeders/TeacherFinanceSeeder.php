<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TeacherWallet;
use App\Models\WalletTransaction;
use App\Models\Earning;
use App\Models\PayoutRequest;
use App\Models\TeachingSession;
use Carbon\Carbon;

class TeacherFinanceSeeder extends Seeder
{
    /**
     * Run the financial seeders in the correct order.
     */
    public function run(): void
    {
        // Call the financial seeders in the correct order
        $this->call([
            TeacherWalletSeeder::class,
            WalletTransactionSeeder::class,
            EarningSeeder::class,
            PayoutRequestSeeder::class,
        ]);
    }
    
    /**
     * Create wallet transactions for a teacher.
     *
     * @param TeacherWallet $wallet
     * @return void
     */
    private function createWalletTransactions(TeacherWallet $wallet): void
    {
        $balance = 0;
        
        // Create 10-20 transactions
        $transactionCount = rand(10, 20);
        
        for ($i = 0; $i < $transactionCount; $i++) {
            $amount = rand(1000, 5000);
            $type = rand(0, 2) > 0 ? 'credit' : 'debit'; // 2/3 chance of credit
            
            // Skip debit if balance would go negative
            if ($type === 'debit' && $balance < $amount) {
                $type = 'credit';
            }
            
            $balanceBefore = $balance;
            
            if ($type === 'credit') {
                $balance += $amount;
                $description = $this->getRandomCreditDescription();
            } else {
                $balance -= $amount;
                $description = $this->getRandomDebitDescription();
            }
            
            // Create transaction
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'amount' => $amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balance,
                'type' => $type,
                'status' => 'completed',
                'description' => $description,
                'reference' => 'TXN-' . uniqid(),
                'created_at' => Carbon::now()->subDays(rand(1, 60)),
                'updated_at' => Carbon::now()->subDays(rand(0, 1)),
            ]);
        }
        
        // Update the wallet balance to match the final balance
        $wallet->update(['balance' => $balance]);
    }
    
    /**
     * Create earnings for a teacher.
     *
     * @param User $teacher
     * @return void
     */
    private function createEarnings(User $teacher): void
    {
        // Create 5-15 earnings
        $earningCount = rand(5, 15);
        
        for ($i = 0; $i < $earningCount; $i++) {
            $amount = rand(1000, 5000);
            $status = $this->getRandomEarningStatus();
            $created = Carbon::now()->subDays(rand(1, 90));
            
            // Create earning
            Earning::create([
                'user_id' => $teacher->id,
                'teaching_session_id' => null, // We don't have actual teaching sessions
                'amount' => $amount,
                'currency' => 'NGN',
                'status' => $status,
                'payout_date' => $status === 'paid' ? $created->copy()->addDays(rand(1, 7)) : null,
                'created_at' => $created,
                'updated_at' => $created->copy()->addDays(rand(0, 3)),
            ]);
        }
    }
    
    /**
     * Create payout requests for a teacher.
     *
     * @param User $teacher
     * @param TeacherWallet $wallet
     * @return void
     */
    private function createPayoutRequests(User $teacher, TeacherWallet $wallet): void
    {
        // Create 1-5 payout requests
        $payoutCount = rand(1, 5);
        
        for ($i = 0; $i < $payoutCount; $i++) {
            $amount = rand(1000, min(5000, $wallet->balance));
            $status = $this->getRandomPayoutStatus();
            $created = Carbon::now()->subDays(rand(1, 30));
            $processed = $status !== 'pending' ? $created->copy()->addDays(rand(1, 5)) : null;
            
            // Create payout request
            PayoutRequest::create([
                'user_id' => $teacher->id,
                'amount' => $amount,
                'currency' => 'NGN',
                'status' => $status,
                'payment_method' => $this->getRandomPaymentMethod(),
                'payment_details' => $this->getPaymentDetails(),
                'processed_at' => $processed,
                'processed_by' => $processed ? User::where('role', 'admin')->inRandomOrder()->first()->id : null,
                'created_at' => $created,
                'updated_at' => $processed ?? $created,
            ]);
        }
    }
    
    /**
     * Get a random credit description.
     *
     * @return string
     */
    private function getRandomCreditDescription(): string
    {
        $descriptions = [
            'Payment for teaching session',
            'Bonus for excellent teaching',
            'Referral bonus',
            'Session payment',
            'Monthly teaching payment',
            'Student payment',
            'Teaching session completed',
            'Quran class payment',
            'Islamic studies session',
            'Arabic language class payment',
        ];
        
        return $descriptions[array_rand($descriptions)];
    }
    
    /**
     * Get a random debit description.
     *
     * @return string
     */
    private function getRandomDebitDescription(): string
    {
        $descriptions = [
            'Payout to bank account',
            'Withdrawal request',
            'Bank transfer payout',
            'Payout processed',
            'Withdrawal to mobile money',
            'Payout to payment card',
        ];
        
        return $descriptions[array_rand($descriptions)];
    }
    
    /**
     * Get a random earning status.
     *
     * @return string
     */
    private function getRandomEarningStatus(): string
    {
        $statuses = [
            'pending' => 20,
            'paid' => 70,
            'cancelled' => 10,
        ];
        
        return $this->getRandomWeighted($statuses);
    }
    
    /**
     * Get a random payout status.
     *
     * @return string
     */
    private function getRandomPayoutStatus(): string
    {
        $statuses = [
            'pending' => 30,
            'approved' => 20,
            'rejected' => 10,
            'completed' => 40,
        ];
        
        return $this->getRandomWeighted($statuses);
    }
    
    /**
     * Get a random payment method.
     *
     * @return string
     */
    private function getRandomPaymentMethod(): string
    {
        $methods = [
            'bank_transfer',
            'mobile_money',
            'paypal',
            'payoneer',
        ];
        
        return $methods[array_rand($methods)];
    }
    
    /**
     * Get random payment details based on payment method.
     *
     * @return array
     */
    private function getPaymentDetails(): array
    {
        return [
            'bank_name' => 'Sample Bank',
            'account_number' => '0123456789',
            'account_name' => 'Teacher Name',
            'swift_code' => 'SBNGNGLA',
        ];
    }
    
    /**
     * Get a random value from a weighted array.
     *
     * @param array $weighted
     * @return string
     */
    private function getRandomWeighted(array $weighted): string
    {
        $total = array_sum($weighted);
        $rand = rand(1, $total);
        
        foreach ($weighted as $key => $value) {
            $rand -= $value;
            if ($rand <= 0) {
                return $key;
            }
        }
        
        return array_key_first($weighted);
    }
}
