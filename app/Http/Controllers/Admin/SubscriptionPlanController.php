<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of subscription plans.
     */
    public function index()
    {
        $plans = SubscriptionPlan::withCount('subscriptions as enrolled_users')
            ->get()
            ->map(function ($plan) {
                // Format price to show both local currency and USD
                $usdPrice = $plan->price / 500; // Example conversion rate
                $formattedPrice = '₦' . number_format($plan->price) . ' / $' . number_format($usdPrice, 0);
                
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => $formattedPrice,
                    'billing_period' => ucfirst($plan->billing_period),
                    'enrolled_users' => $plan->enrolled_users,
                    'status' => $plan->is_active ? 'Active' : 'Inactive',
                    'is_active' => $plan->is_active,
                ];
            });

        return Inertia::render('admin/subscription-plans', [
            'plans' => $plans
        ]);
    }

    /**
     * Show the form for creating/editing a subscription plan.
     */
    public function edit(SubscriptionPlan $plan = null)
    {
        return Inertia::render('admin/subscription-plan-edit', [
            'plan' => $plan
        ]);
    }

    /**
     * Store a newly created or update an existing subscription plan.
     */
    public function store(Request $request, SubscriptionPlan $plan = null)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'currency' => 'required|string',
                'billing_period' => 'required|string|in:month,year',
                'description' => 'nullable|string',
                'estimated_duration' => 'nullable|string',
                'daily_quran_sessions' => 'boolean',
                'weekly_assessments' => 'boolean',
                'progress_tracking_dashboard' => 'boolean',
                'final_certificate' => 'boolean',
                'personalized_learning_plan' => 'boolean',
                'tags' => 'nullable',
                'is_active' => 'boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            // Parse tags if it's a JSON string
            if (isset($validated['tags']) && is_string($validated['tags'])) {
                $validated['tags'] = json_decode($validated['tags'], true);
            }

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('subscription_plans', 'public');
                $validated['image'] = $imagePath;
            }

            if ($plan) {
                $plan->update($validated);
            } else {
                $plan = SubscriptionPlan::create($validated);
            }

            return redirect()->route('admin.subscription-plans.index')
                ->with('success', 'Subscription plan saved successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log detailed validation errors
            Log::error('Validation error in SubscriptionPlanController::store', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            throw $e; // Re-throw to let Laravel handle the response
        } catch (\Exception $e) {
            // Log any other exceptions
            Log::error('Error in SubscriptionPlanController::store: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
            
            return back()->withErrors(['general_error' => 'An unexpected error occurred: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle the status of a subscription plan.
     */
    public function toggleStatus(SubscriptionPlan $plan)
    {
        $plan->is_active = !$plan->is_active;
        $plan->save();

        return back()->with('success', 'Plan status updated successfully.');
    }

    /**
     * Duplicate a subscription plan.
     */
    public function duplicate(SubscriptionPlan $plan)
    {
        $newPlan = $plan->replicate();
        $newPlan->name = $plan->name . ' (Copy)';
        $newPlan->save();

        return back()->with('success', 'Plan duplicated successfully.');
    }

    /**
     * Delete a subscription plan.
     */
    public function destroy(SubscriptionPlan $plan)
    {
        // Check if plan has any active subscriptions
        if ($plan->subscriptions()->where('status', 'active')->count() > 0) {
            return back()->with('error', 'Cannot delete plan with active subscriptions.');
        }

        $plan->delete();
        return back()->with('success', 'Plan deleted successfully.');
    }

    /**
     * View enrolled users for a subscription plan.
     */
    public function viewEnrolledUsers(SubscriptionPlan $plan)
    {
        $enrolledUsers = $plan->subscriptions()
            ->with('user')
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->user->id,
                    'name' => $subscription->user->name,
                    'email' => $subscription->user->email,
                    'start_date' => $subscription->start_date,
                    'end_date' => $subscription->end_date,
                    'status' => $subscription->status,
                ];
            });

        return response()->json([
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
            ],
            'enrolledUsers' => $enrolledUsers
        ]);
    }
} 