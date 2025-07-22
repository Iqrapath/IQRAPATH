<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\LearningPreference;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Store a newly created student with all related data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|string|email|max:255|unique:users,email',
            'user.phone_number' => 'required|string|max:20',
            'user.location' => 'required|string|max:255',
            'subscription.activePlan' => 'required|string',
            'subscription.startDate' => 'required|date',
            'subscription.endDate' => 'required|date|after:subscription.startDate',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // 1. Create the user
            $user = new User();
            $user->name = $request->input('user.name');
            $user->email = $request->input('user.email');
            $user->password = Hash::make('password123'); // Default password, should be changed by user
            $user->role = 'student';
            $user->status = strtolower($request->input('user.status', 'active'));
            $user->phone_number = $request->input('user.phone_number');
            $user->location = $request->input('user.location');
            $user->registration_date = $request->input('user.registration_date') ?
                Carbon::parse($request->input('user.registration_date')) :
                Carbon::now();
            $user->save();

            // 2. Create the student profile
            $studentProfile = new StudentProfile();
            $studentProfile->user_id = $user->id;

            // Map form fields to model fields
            $ageGroup = $request->input('preferences.studentAgeGroup');
            $dateOfBirth = $this->estimateDateOfBirthFromAgeGroup($ageGroup);

            $studentProfile->date_of_birth = $dateOfBirth;
            $studentProfile->education_level = $this->mapAgeGroupToEducationLevel($ageGroup);
            $studentProfile->subjects_of_interest = $request->input('preferences.preferredSubjects', []);
            $studentProfile->preferred_learning_method = $request->input('preferences.teachingMode') === 'full-time' ? 'intensive' : 'regular';
            $studentProfile->save();

            // 3. Save learning preferences
            $learningPreference = new LearningPreference();
            $learningPreference->user_id = $user->id;
            $learningPreference->preferred_subjects = $request->input('preferences.preferredSubjects', []);
            $learningPreference->teaching_mode = $request->input('preferences.teachingMode');
            $learningPreference->student_age_group = $ageGroup;
            $learningPreference->preferred_learning_times = $request->input('preferences.preferredLearningTimes', []);
            $learningPreference->additional_notes = $request->input('preferences.additionalNotes');
            $learningPreference->save();

            // 4. Find or create the subscription plan
            $planName = $request->input('subscription.activePlan');
            $subscriptionPlan = SubscriptionPlan::firstOrCreate(
                ['name' => $planName],
                [
                    'price' => $this->extractPriceFromPlanName($planName),
                    'billing_period' => 'monthly',
                    'description' => $planName,
                    'is_active' => true
                ]
            );

            // 5. Create subscription
            $subscription = new Subscription();
            $subscription->user_id = $user->id;
            $subscription->subscription_plan_id = $subscriptionPlan->id;
            $subscription->start_date = Carbon::parse($request->input('subscription.startDate'));
            $subscription->end_date = Carbon::parse($request->input('subscription.endDate'));
            $subscription->status = strtolower($request->input('subscription.status', 'active'));
            $subscription->notes = $request->input('subscription.additionalNotes');
            $subscription->save();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Student created successfully',
                'student' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ]
            ], 201);

        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student data by ID with associated relations.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            // Find the user with the given ID who has the student role
            $user = User::where('id', $id)
                        ->where('role', 'student')
                        ->firstOrFail();

            // Load relationships
            $user->load([
                'studentProfile',
                'learningPreference',
                'subscriptions' => function($query) {
                    $query->with('plan')->latest();
                }
            ]);

            // Format the response data
            $response = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'location' => $user->location,
                    'status' => ucfirst($user->status),
                    'registration_date' => $user->registration_date ? $user->registration_date->format('Y-m-d') : null,
                ],
                'preferences' => null,
                'subscription' => null
            ];

            // Add learning preferences if they exist
            if ($user->learningPreference) {
                $preferences = $user->learningPreference;
                $response['preferences'] = [
                    'preferredSubjects' => $preferences->preferred_subjects,
                    'teachingMode' => $preferences->teaching_mode,
                    'studentAgeGroup' => $preferences->student_age_group,
                    'preferredLearningTimes' => $preferences->preferred_learning_times,
                    'additionalNotes' => $preferences->additional_notes,
                ];
            }

            // Add subscription if it exists
            if ($user->subscriptions->isNotEmpty()) {
                $subscription = $user->subscriptions->first();
                $response['subscription'] = [
                    'activePlan' => $subscription->plan->name,
                    'startDate' => $subscription->start_date->format('Y-m-d'),
                    'endDate' => $subscription->end_date->format('Y-m-d'),
                    'status' => ucfirst($subscription->status),
                    'additionalNotes' => $subscription->notes,
                ];
            }

            return response()->json($response);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve student data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extract the price from the plan name.
     *
     * @param string $planName
     * @return float
     */
    private function extractPriceFromPlanName(string $planName): float
    {
        // Example plan name: "Juz' Amma - ₦10,000/month"
        preg_match('/₦([0-9,]+)/', $planName, $matches);

        if (isset($matches[1])) {
            // Remove commas and convert to float
            return (float) str_replace(',', '', $matches[1]);
        }

        return 0.0;
    }

    /**
     * Estimate a date of birth from an age group.
     *
     * @param string $ageGroup
     * @return \Carbon\Carbon
     */
    private function estimateDateOfBirthFromAgeGroup(string $ageGroup): Carbon
    {
        // Extract the age range from the age group string
        preg_match('/(\d+)-?(\d+)?/', $ageGroup, $matches);

        $lowerAge = (int) ($matches[1] ?? 10);
        $upperAge = (int) ($matches[2] ?? $lowerAge);

        // Use the average age in the range
        $averageAge = ($lowerAge + $upperAge) / 2;

        // Calculate an approximate date of birth
        return Carbon::now()->subYears(round($averageAge));
    }

    /**
     * Map age group to education level.
     *
     * @param string $ageGroup
     * @return string
     */
    private function mapAgeGroupToEducationLevel(string $ageGroup): string
    {
        return match (true) {
            str_contains($ageGroup, '4-6') => 'Preschool',
            str_contains($ageGroup, '7-9') => 'Elementary',
            str_contains($ageGroup, '10-12') => 'Middle School',
            str_contains($ageGroup, '13-15') => 'Junior High',
            str_contains($ageGroup, '16-18') => 'High School',
            str_contains($ageGroup, 'Adults') => 'Adult Education',
            default => 'Elementary',
        };
    }

    /**
     * Get statistics for the student dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getStats(Request $request)
    {
        try {
            $userId = $request->user()->id;

            // Get teaching sessions stats from database
            $totalClasses = \App\Models\TeachingSession::forStudent($userId)->count();
            
            $completedClasses = \App\Models\TeachingSession::forStudent($userId)
                ->completed()
                ->count();
            
            $upcomingClasses = \App\Models\TeachingSession::forStudent($userId)
                ->upcoming()
                ->count();

            $stats = [
                'totalClasses' => $totalClasses,
                'completedClasses' => $completedClasses,
                'upcomingClasses' => $upcomingClasses
            ];

            // Return in API-style format for both web and API requests
            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'message' => 'Failed to retrieve student stats',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    /**
     * Get upcoming classes for the authenticated student.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getUpcomingClasses(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            // Get upcoming classes from the teaching_sessions table
            $upcomingClasses = \App\Models\TeachingSession::forStudent($userId)
                ->upcoming()
                ->with(['teacher:id,name', 'subscriptionPlan:id,name,image']) // Include teacher and subscription plan information
                ->orderBy('scheduled_start_time', 'asc')
                ->take(5) // Limit to 5 upcoming classes
                ->get()
                ->map(function($session) {
                    // Format the data for the frontend
                    $startTime = new \Carbon\Carbon($session->scheduled_start_time);
                    $endTime = new \Carbon\Carbon($session->scheduled_end_time);
                    
                    return [
                        'id' => $session->id,
                        'title' => $session->subject . ($session->session_topic ? ' - ' . $session->session_topic : ''),
                        'teacher' => $session->teacher->name,
                        'date' => $startTime->format('l, F j, Y'),
                        'timeRange' => $startTime->format('g:i A') . ' - ' . $endTime->format('g:i A'),
                        'status' => $this->mapSessionStatus($session->status),
                        'image' => $session->image // This uses the getImageAttribute accessor from the TeachingSession model
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => [
                    'upcomingClasses' => $upcomingClasses
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'message' => 'Failed to retrieve upcoming classes',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }

    /**
     * Map database session status to frontend status.
     * 
     * @param string $status
     * @return string
     */
    private function mapSessionStatus($status)
    {
        $statusMap = [
            'scheduled' => 'pending',
            'confirmed' => 'confirmed',
            'in_progress' => 'confirmed',
            'completed' => 'completed',
            'cancelled_by_teacher' => 'cancelled',
            'cancelled_by_student' => 'cancelled',
            'cancelled_by_guardian' => 'cancelled',
            'cancelled_by_admin' => 'cancelled',
            'no_show' => 'cancelled'
        ];
        
        return $statusMap[strtolower($status)] ?? 'pending';
    }

    /**
     * Get image URL for subject.
     * 
     * @param string $subject
     * @return string
     */
    private function getSubjectImage($subject)
    {
        // Map common subjects to image paths
        $subjectImages = [
            'Tajweed' => '/assets/images/classes/tajweed.png',
            'Fiqh' => '/assets/images/classes/fiqh.png',
            'Quran' => '/assets/images/classes/quran.png',
            'Hadith' => '/assets/images/classes/hadith.png',
            'Aqidah' => '/assets/images/classes/aqidah.png',
        ];
        
        // Extract first word of subject as key
        $subjectKey = explode(' ', $subject)[0];
        
        // Default to a generic image if not found
        return $subjectImages[$subjectKey] ?? '/assets/images/classes/default.png';
    }
}
