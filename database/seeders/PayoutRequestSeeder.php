<?php

namespace Database\Seeders;

use App\Models\PayoutRequest;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;

class PayoutRequestSeeder extends Seeder
{
    /**
     * Seed the payout requests table.
     */
    public function run(): void
    {
        // Get demo teacher
        $demoTeacher = User::where('email', 'teacher@iqrapath.com')->first();

        if ($demoTeacher) {
            // Create payout requests for demo teacher
            $this->createPayoutRequestsForTeacher($demoTeacher, 3);
        }

        // Get all teachers except demo teacher
        $teachers = User::where('role', 'teacher')
            ->where('email', '!=', 'teacher@iqrapath.com')
            ->get();

        // Create payout requests for each teacher
        foreach ($teachers as $teacher) {
            // Create 0-3 payout requests per teacher
            $requestCount = $this->faker()->numberBetween(0, 3);
            
            if ($requestCount > 0) {
                $this->createPayoutRequestsForTeacher($teacher, $requestCount);
            }
        }
    }

    /**
     * Create payout requests for a specific teacher.
     *
     * @param User $teacher
     * @param int $count
     */
    private function createPayoutRequestsForTeacher(User $teacher, int $count): void
    {
        // Get admin user for processing
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $admin = User::factory()->create([
                'role' => 'admin',
                'status' => 'active',
            ]);
        }
        
        // Get teacher wallet
        $wallet = $teacher->teacherWallet;
        
        if (!$wallet) {
            return;
        }
        
        // Create payout requests
        for ($i = 0; $i < $count; $i++) {
            // Determine status
            $status = $this->getRandomStatus($i, $count);
            
            // Determine amount (ensure it's not more than wallet balance for completed requests)
            $maxAmount = $status === 'completed' ? min(500, $wallet->balance * 0.8) : 500;
            $amount = $this->faker()->randomFloat(2, 50, max(50, $maxAmount));
            
            // Create payment details
            $paymentMethod = $this->faker()->randomElement(['bank_transfer', 'paypal', 'mobile_money']);
            $paymentDetails = $this->getPaymentDetails($paymentMethod);
            
            // Create the request
            switch ($status) {
                case 'pending':
                    PayoutRequest::factory()->pending()->create([
                        'user_id' => $teacher->id,
                        'amount' => $amount,
                        'currency' => $wallet->currency,
                        'payment_method' => $paymentMethod,
                        'payment_details' => $paymentDetails,
                    ]);
                    break;
                    
                case 'approved':
                    PayoutRequest::factory()->approved()->create([
                        'user_id' => $teacher->id,
                        'amount' => $amount,
                        'currency' => $wallet->currency,
                        'payment_method' => $paymentMethod,
                        'payment_details' => $paymentDetails,
                        'processed_by' => $admin->id,
                    ]);
                    break;
                    
                case 'rejected':
                    PayoutRequest::factory()->rejected()->create([
                        'user_id' => $teacher->id,
                        'amount' => $amount,
                        'currency' => $wallet->currency,
                        'payment_method' => $paymentMethod,
                        'payment_details' => $paymentDetails,
                        'processed_by' => $admin->id,
                    ]);
                    break;
                    
                case 'completed':
                    // Create a wallet transaction for the payout
                    $transaction = WalletTransaction::factory()->debit()->completed()->create([
                        'wallet_id' => $wallet->id,
                        'amount' => $amount,
                        'description' => 'Payout request #' . $this->faker()->numberBetween(1000, 9999),
                        'metadata' => [
                            'source' => 'payout',
                            'payment_method' => $paymentMethod,
                        ],
                    ]);
                    
                    PayoutRequest::factory()->completed($transaction)->create([
                        'user_id' => $teacher->id,
                        'amount' => $amount,
                        'currency' => $wallet->currency,
                        'payment_method' => $paymentMethod,
                        'payment_details' => $paymentDetails,
                        'processed_by' => $admin->id,
                    ]);
                    break;
            }
        }
    }

    /**
     * Get a random status based on position in sequence.
     *
     * @param int $index
     * @param int $total
     * @return string
     */
    private function getRandomStatus(int $index, int $total): string
    {
        // For demo teacher or if this is the last request, make it pending
        if ($index === $total - 1) {
            return 'pending';
        }
        
        // Otherwise randomize status
        $statuses = ['completed', 'approved', 'rejected', 'pending'];
        $weights = [50, 20, 10, 20]; // Higher chance of completed
        
        return $this->getRandomWeightedElement($statuses, $weights);
    }

    /**
     * Get payment details based on payment method.
     *
     * @param string $paymentMethod
     * @return array
     */
    private function getPaymentDetails(string $paymentMethod): array
    {
        switch ($paymentMethod) {
            case 'bank_transfer':
                return [
                    'bank_name' => $this->faker()->company(),
                    'account_name' => $this->faker()->name(),
                    'account_number' => $this->faker()->numerify('##########'),
                    'sort_code' => $this->faker()->numerify('######'),
                ];
                
            case 'paypal':
                return [
                    'email' => $this->faker()->email(),
                ];
                
            case 'mobile_money':
                return [
                    'provider' => $this->faker()->randomElement(['MTN', 'Airtel', 'Vodafone']),
                    'phone_number' => $this->faker()->phoneNumber(),
                    'account_name' => $this->faker()->name(),
                ];
                
            default:
                return [];
        }
    }

    /**
     * Get a random element from an array with weighted probabilities.
     *
     * @param array $elements
     * @param array $weights
     * @return mixed
     */
    private function getRandomWeightedElement(array $elements, array $weights)
    {
        $totalWeight = array_sum($weights);
        $randomWeight = $this->faker()->numberBetween(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($elements as $index => $element) {
            $currentWeight += $weights[$index];
            
            if ($randomWeight <= $currentWeight) {
                return $element;
            }
        }
        
        return $elements[0];
    }

    /**
     * Get a faker instance.
     */
    private function faker()
    {
        return \Faker\Factory::create();
    }
} 