<?php

namespace App\Services;

use App\Models\User;
use App\Models\TeacherWallet;
use App\Models\WalletTransaction;
use App\Models\Earning;
use App\Models\PayoutRequest;
use App\Models\TeachingSession;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherFinanceService
{
    /**
     * Get or create a wallet for a teacher.
     *
     * @param User $user
     * @param string $currency
     * @return TeacherWallet
     */
    public function getOrCreateWallet(User $user, string $currency = 'NGN'): TeacherWallet
    {
        $wallet = $user->teacherWallet;

        if (!$wallet) {
            $wallet = TeacherWallet::create([
                'user_id' => $user->id,
                'balance' => 0,
                'currency' => $currency,
                'is_active' => true,
            ]);
        }

        return $wallet;
    }

    /**
     * Credit a teacher's wallet.
     *
     * @param User $user
     * @param float $amount
     * @param string $description
     * @param string|null $reference
     * @param array|null $metadata
     * @return WalletTransaction|null
     */
    public function creditWallet(User $user, float $amount, string $description, ?string $reference = null, ?array $metadata = null): ?WalletTransaction
    {
        try {
            $wallet = $this->getOrCreateWallet($user);
            return $wallet->credit($amount, $description, $reference, $metadata);
        } catch (Exception $e) {
            Log::error('Failed to credit wallet: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'amount' => $amount,
                'description' => $description,
                'reference' => $reference,
            ]);
            return null;
        }
    }

    /**
     * Debit a teacher's wallet.
     *
     * @param User $user
     * @param float $amount
     * @param string $description
     * @param string|null $reference
     * @param array|null $metadata
     * @return WalletTransaction|bool
     */
    public function debitWallet(User $user, float $amount, string $description, ?string $reference = null, ?array $metadata = null)
    {
        try {
            $wallet = $this->getOrCreateWallet($user);
            return $wallet->debit($amount, $description, $reference, $metadata);
        } catch (Exception $e) {
            Log::error('Failed to debit wallet: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'amount' => $amount,
                'description' => $description,
                'reference' => $reference,
            ]);
            return false;
        }
    }

    /**
     * Record earnings for a completed teaching session.
     *
     * @param TeachingSession $session
     * @return Earning|null
     */
    public function recordSessionEarning(TeachingSession $session): ?Earning
    {
        try {
            return DB::transaction(function () use ($session) {
                $teacher = $session->teacher;
                $amount = $session->amount;
                $currency = $session->currency ?? 'NGN';

                // Create earning record
                $earning = Earning::create([
                    'user_id' => $teacher->id,
                    'teaching_session_id' => $session->id,
                    'amount' => $amount,
                    'currency' => $currency,
                    'status' => 'pending',
                ]);

                return $earning;
            });
        } catch (Exception $e) {
            Log::error('Failed to record session earning: ' . $e->getMessage(), [
                'session_id' => $session->id,
                'teacher_id' => $session->teacher_id,
            ]);
            return null;
        }
    }

    /**
     * Process a payout request.
     *
     * @param PayoutRequest $payoutRequest
     * @param User $admin
     * @param string $status
     * @param string|null $note
     * @return bool
     */
    public function processPayoutRequest(PayoutRequest $payoutRequest, User $admin, string $status, ?string $note = null): bool
    {
        try {
            return DB::transaction(function () use ($payoutRequest, $admin, $status, $note) {
                $user = $payoutRequest->user;
                
                if ($status === 'approved' || $status === 'completed') {
                    // Debit the wallet
                    $transaction = $this->debitWallet(
                        $user,
                        $payoutRequest->amount,
                        'Payout: ' . $payoutRequest->payment_method,
                        'PAYOUT-' . $payoutRequest->id,
                        [
                            'payout_request_id' => $payoutRequest->id,
                            'payment_method' => $payoutRequest->payment_method,
                            'processed_by' => $admin->id,
                            'note' => $note,
                        ]
                    );

                    if (!$transaction) {
                        throw new Exception('Failed to debit wallet for payout');
                    }

                    // Update payout request
                    $payoutRequest->update([
                        'status' => $status,
                        'processed_at' => now(),
                        'processed_by' => $admin->id,
                        'transaction_id' => $transaction->id,
                    ]);
                } else {
                    // Just update status for rejected requests
                    $payoutRequest->update([
                        'status' => $status,
                        'processed_at' => now(),
                        'processed_by' => $admin->id,
                    ]);
                }

                return true;
            });
        } catch (Exception $e) {
            Log::error('Failed to process payout request: ' . $e->getMessage(), [
                'payout_request_id' => $payoutRequest->id,
                'user_id' => $payoutRequest->user_id,
                'status' => $status,
            ]);
            return false;
        }
    }

    /**
     * Get financial summary for a teacher.
     *
     * @param \App\Models\User $teacher
     * @return array
     */
    public function getFinancialSummary($teacher)
    {
        // In a real implementation, this would query the database for actual financial data
        // For now, we'll return mock data or data from the teacher profile if available
        
        // Check if the teacher has a profile with financial data
        if ($teacher->teacherProfile) {
            $profile = $teacher->teacherProfile;
            
            // Calculate wallet balance from transactions if available
            $walletBalance = $this->calculateWalletBalance($teacher->id);
            
            // Calculate total earned from completed sessions
            $totalEarned = $this->calculateTotalEarned($teacher->id);
            
            // Calculate pending payouts
            $pendingPayouts = $this->calculatePendingPayouts($teacher->id);
            
            // Calculate available for payout (wallet balance minus pending payouts)
            $availableForPayout = max(0, $walletBalance - $pendingPayouts);
            
            return [
                'wallet_balance' => $walletBalance,
                'total_earned' => $totalEarned,
                'pending_payouts' => $pendingPayouts,
                'available_for_payout' => $availableForPayout
            ];
        }
        
        // Default values if no profile exists
        return [
            'wallet_balance' => 0,
            'total_earned' => 0,
            'pending_payouts' => 0,
            'available_for_payout' => 0
        ];
    }

    /**
     * Calculate wallet balance for a teacher.
     *
     * @param int $teacherId
     * @return float
     */
    private function calculateWalletBalance($teacherId)
    {
        $wallet = TeacherWallet::where('user_id', $teacherId)->first();
        return $wallet ? $wallet->balance : 0;
    }

    /**
     * Calculate total earned for a teacher.
     *
     * @param int $teacherId
     * @return float
     */
    private function calculateTotalEarned($teacherId)
    {
        return Earning::where('user_id', $teacherId)
            ->where('status', '!=', 'cancelled')
            ->sum('amount');
    }

    /**
     * Calculate pending payouts for a teacher.
     *
     * @param int $teacherId
     * @return float
     */
    private function calculatePendingPayouts($teacherId)
    {
        return PayoutRequest::where('user_id', $teacherId)
            ->where('status', 'pending')
            ->sum('amount');
    }

    /**
     * Get all transactions for a teacher.
     *
     * @param int $teacherId
     * @return array
     */
    public function getTransactions($teacherId)
    {
        $wallet = TeacherWallet::where('user_id', $teacherId)->first();
        
        if (!$wallet) {
            return [];
        }
        
        $transactions = WalletTransaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($transaction) {
                $data = [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'status' => $transaction->status,
                    'date' => $transaction->created_at->toDateTimeString(),
                    'description' => $transaction->description,
                    'reference' => $transaction->reference
                ];
                
                // Add student name if this is a session payment
                if (strpos($transaction->description, 'Payment for') !== false && isset($transaction->metadata['teaching_session_id'])) {
                    $sessionId = $transaction->metadata['teaching_session_id'];
                    $session = TeachingSession::find($sessionId);
                    if ($session && $session->student) {
                        $data['student_name'] = $session->student->name;
                    }
                }
                
                return $data;
            })
            ->toArray();
            
        return $transactions;
    }

    /**
     * Get monthly earnings for a teacher.
     *
     * @param int $teacherId
     * @return array
     */
    public function getMonthlyEarnings($teacherId)
    {
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        
        $monthlyEarnings = Earning::where('user_id', $teacherId)
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->select(
                DB::raw('SUM(amount) as amount'),
                DB::raw("DATE_FORMAT(created_at, '%M %Y') as month"),
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_sort")
            )
            ->groupBy('month', 'month_sort')
            ->orderBy('month_sort', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'amount' => (float) $item->amount
                ];
            })
            ->toArray();
            
        return $monthlyEarnings;
    }

    /**
     * Process a payout for a teacher.
     *
     * @param \App\Models\User $teacher
     * @param float $amount
     * @return array
     */
    public function processPayout($teacher, $amount)
    {
        try {
            return DB::transaction(function () use ($teacher, $amount) {
                // Validate the teacher has sufficient funds
                $financialData = $this->getFinancialSummary($teacher);
                
                if ($amount <= 0) {
                    return [
                        'success' => false,
                        'message' => 'Invalid payout amount'
                    ];
                }
                
                if ($financialData['wallet_balance'] < $amount) {
                    return [
                        'success' => false,
                        'message' => 'Insufficient funds for payout'
                    ];
                }
                
                // Create a payout request
                $payoutRequest = PayoutRequest::create([
                    'user_id' => $teacher->id,
                    'amount' => $amount,
                    'currency' => 'NGN', // Default currency
                    'status' => 'pending',
                    'payment_method' => 'bank_transfer', // Default method
                    'payment_details' => json_encode([
                        'requested_at' => now()->toDateTimeString()
                    ])
                ]);
                
                return [
                    'success' => true,
                    'message' => 'Payout request submitted successfully',
                    'payout_request' => $payoutRequest
                ];
            });
        } catch (Exception $e) {
            Log::error('Failed to process payout: ' . $e->getMessage(), [
                'user_id' => $teacher->id,
                'amount' => $amount
            ]);
            
            return [
                'success' => false,
                'message' => 'An error occurred while processing your payout request'
            ];
        }
    }

    /**
     * Get payout requests for a teacher.
     *
     * @param int $teacherId
     * @return array
     */
    public function getPayoutRequests($teacherId)
    {
        return PayoutRequest::where('user_id', $teacherId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'amount' => $request->amount,
                    'currency' => $request->currency,
                    'status' => $request->status,
                    'payment_method' => $request->payment_method,
                    'payment_details' => $request->payment_details,
                    'created_at' => $request->created_at->toDateTimeString(),
                    'processed_at' => $request->processed_at ? $request->processed_at->toDateTimeString() : null,
                    'processed_by' => $request->processed_by
                ];
            })
            ->toArray();
    }
} 