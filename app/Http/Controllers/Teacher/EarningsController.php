<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\TeacherFinanceService;
use App\Models\PayoutRequest;
use App\Models\Earning;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class EarningsController extends Controller
{
    protected $financeService;

    /**
     * Create a new controller instance.
     *
     * @param TeacherFinanceService $financeService
     * @return void
     */
    public function __construct(TeacherFinanceService $financeService)
    {
        $this->financeService = $financeService;
        // Middleware will be applied in the routes file
    }

    /**
     * Display the teacher's earnings dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $financialSummary = $this->financeService->getFinancialSummary($user);
        
        // Get recent transactions
        $recentTransactions = WalletTransaction::whereHas('wallet', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('wallet')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($transaction) {
                return [
                    'id' => $transaction->id,
                    'date' => $transaction->created_at->format('Y-m-d'),
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'status' => $transaction->status,
                ];
            });
        
        // Get recent earnings
        $recentEarnings = Earning::where('user_id', $user->id)
            ->with('teachingSession')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($earning) {
                return [
                    'id' => $earning->id,
                    'date' => $earning->created_at->format('Y-m-d'),
                    'session' => $earning->teachingSession ? [
                        'id' => $earning->teachingSession->id,
                        'student' => $earning->teachingSession->student->name ?? 'Unknown Student',
                        'date' => $earning->teachingSession->scheduled_start_time->format('Y-m-d'),
                        'time' => $earning->teachingSession->scheduled_start_time->format('H:i'),
                    ] : null,
                    'amount' => $earning->amount,
                    'status' => $earning->status,
                ];
            });
        
        // Get recent payout requests
        $recentPayouts = PayoutRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($payout) {
                return [
                    'id' => $payout->id,
                    'date' => $payout->created_at->format('Y-m-d'),
                    'amount' => $payout->amount,
                    'status' => $payout->status,
                    'payment_method' => $payout->payment_method,
                    'processed_at' => $payout->processed_at ? $payout->processed_at->format('Y-m-d') : null,
                ];
            });
        
        return Inertia::render('teacher/earnings/dashboard', [
            'financialSummary' => $financialSummary,
            'recentTransactions' => $recentTransactions,
            'recentEarnings' => $recentEarnings,
            'recentPayouts' => $recentPayouts,
        ]);
    }

    /**
     * Display the teacher's transactions history.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function transactions(Request $request)
    {
        $user = Auth::user();
        
        $query = WalletTransaction::whereHas('wallet', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('wallet');
        
        // Apply filters
        if ($request->has('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }
        
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }
        
        // Get paginated results
        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function($transaction) {
                return [
                    'id' => $transaction->id,
                    'date' => $transaction->created_at->format('Y-m-d'),
                    'description' => $transaction->description,
                    'reference' => $transaction->reference,
                    'amount' => $transaction->amount,
                    'balance_before' => $transaction->balance_before,
                    'balance_after' => $transaction->balance_after,
                    'type' => $transaction->type,
                    'status' => $transaction->status,
                ];
            });
        
        return Inertia::render('teacher/earnings/transactions', [
            'transactions' => $transactions,
            'filters' => [
                'type' => $request->input('type', 'all'),
                'status' => $request->input('status', 'all'),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
        ]);
    }

    /**
     * Display the teacher's earnings history.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function earnings(Request $request)
    {
        $user = Auth::user();
        
        $query = Earning::where('user_id', $user->id)
            ->with('teachingSession');
        
        // Apply filters
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }
        
        // Get paginated results
        $earnings = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function($earning) {
                return [
                    'id' => $earning->id,
                    'date' => $earning->created_at->format('Y-m-d'),
                    'session' => $earning->teachingSession ? [
                        'id' => $earning->teachingSession->id,
                        'student' => $earning->teachingSession->student->name ?? 'Unknown Student',
                        'date' => $earning->teachingSession->scheduled_start_time->format('Y-m-d'),
                        'time' => $earning->teachingSession->scheduled_start_time->format('H:i'),
                    ] : null,
                    'amount' => $earning->amount,
                    'currency' => $earning->currency,
                    'status' => $earning->status,
                    'payout_date' => $earning->payout_date ? $earning->payout_date->format('Y-m-d') : null,
                ];
            });
        
        return Inertia::render('teacher/earnings/history', [
            'earnings' => $earnings,
            'filters' => [
                'status' => $request->input('status', 'all'),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
        ]);
    }

    /**
     * Display the teacher's payout requests.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function payouts(Request $request)
    {
        $user = Auth::user();
        
        $query = PayoutRequest::where('user_id', $user->id);
        
        // Apply filters
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }
        
        // Get paginated results
        $payouts = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function($payout) {
                return [
                    'id' => $payout->id,
                    'date' => $payout->created_at->format('Y-m-d'),
                    'amount' => $payout->amount,
                    'currency' => $payout->currency,
                    'status' => $payout->status,
                    'payment_method' => $payout->payment_method,
                    'payment_details' => $payout->payment_details,
                    'processed_at' => $payout->processed_at ? $payout->processed_at->format('Y-m-d') : null,
                ];
            });
        
        return Inertia::render('teacher/earnings/payouts', [
            'payouts' => $payouts,
            'filters' => [
                'status' => $request->input('status', 'all'),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
            'financialSummary' => $this->financeService->getFinancialSummary($user),
        ]);
    }

    /**
     * Create a new payout request.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function requestPayout(Request $request)
    {
        $user = Auth::user();
        $wallet = $this->financeService->getOrCreateWallet($user);
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'amount' => ['required', 'numeric', 'min:1', 'max:' . $wallet->balance],
            'payment_method' => ['required', 'string'],
            'payment_details' => ['required', 'array'],
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // Create the payout request
        $payoutRequest = PayoutRequest::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'currency' => $wallet->currency,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'payment_details' => $request->payment_details,
        ]);
        
        return redirect()->route('teacher.earnings.payouts')
            ->with('success', 'Payout request submitted successfully. Your request will be processed within 2-3 business days.');
    }
}
