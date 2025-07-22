<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PayoutRequest;
use App\Models\User;
use App\Services\TeacherFinanceService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PayoutManagementController extends Controller
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
    }

    /**
     * Display a listing of payout requests.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = PayoutRequest::with('user');
        
        // Apply filters
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
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
                    'teacher' => [
                        'id' => $payout->user->id,
                        'name' => $payout->user->name,
                        'email' => $payout->user->email,
                        'avatar' => $payout->user->avatar,
                    ],
                    'amount' => $payout->amount,
                    'currency' => $payout->currency,
                    'status' => $payout->status,
                    'payment_method' => $payout->payment_method,
                    'payment_details' => $payout->payment_details,
                    'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
                    'processed_at' => $payout->processed_at ? $payout->processed_at->format('Y-m-d H:i:s') : null,
                    'processed_by' => $payout->processed_by ? User::find($payout->processed_by)->name : null,
                ];
            });
        
        return Inertia::render('admin/payouts/index', [
            'payouts' => $payouts,
            'filters' => [
                'status' => $request->input('status', 'all'),
                'search' => $request->input('search', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
        ]);
    }

    /**
     * Show details of a specific payout request.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $payout = PayoutRequest::with(['user', 'user.teacherWallet'])->findOrFail($id);
        
        $payoutData = [
            'id' => $payout->id,
            'teacher' => [
                'id' => $payout->user->id,
                'name' => $payout->user->name,
                'email' => $payout->user->email,
                'avatar' => $payout->user->avatar,
                'wallet_balance' => $payout->user->teacherWallet ? $payout->user->teacherWallet->balance : 0,
            ],
            'amount' => $payout->amount,
            'currency' => $payout->currency,
            'status' => $payout->status,
            'payment_method' => $payout->payment_method,
            'payment_details' => $payout->payment_details,
            'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
            'processed_at' => $payout->processed_at ? $payout->processed_at->format('Y-m-d H:i:s') : null,
            'processed_by' => $payout->processed_by ? User::find($payout->processed_by)->name : null,
        ];
        
        return Inertia::render('admin/payouts/show', [
            'payout' => $payoutData,
        ]);
    }

    /**
     * Process a payout request.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function process(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', 'in:approved,rejected,completed'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $payout = PayoutRequest::findOrFail($id);
        $admin = Auth::user();
        $status = $request->input('status');
        $note = $request->input('note');
        
        $result = $this->financeService->processPayoutRequest($payout, $admin, $status, $note);
        
        if ($result) {
            $statusMessage = match($status) {
                'approved' => 'approved',
                'rejected' => 'rejected',
                'completed' => 'marked as completed',
                default => 'processed',
            };
            
            return redirect()->route('admin.payouts.index')
                ->with('success', "Payout request successfully {$statusMessage}.");
        } else {
            return back()->with('error', 'Failed to process payout request. Please try again.');
        }
    }
}
