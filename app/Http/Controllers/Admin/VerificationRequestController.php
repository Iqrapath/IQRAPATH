<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VerificationRequest;
use App\Models\User;
use App\Models\DocumentUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Services\TeacherFinanceService;

class VerificationRequestController extends Controller
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
     * Display the details of a verification request
     */
    public function show($id)
    {
        try {
            $request = VerificationRequest::with([
                'teacher' => function($query) {
                    $query->select('id', 'name', 'email', 'avatar', 'location', 'status', 'phone_number');
                }, 
                'teacher.teacherProfile', 
                'documents',
                'reviewer'
            ])->findOrFail($id);
            
            // Get teacher with profile
            $teacher = $request->teacher;
            
            // Get financial data using the finance service
            $financialData = $this->financeService->getFinancialSummary($teacher);
            
            // Format the teacher profile data for the frontend
            $teacherProfileData = $teacher->teacherProfile ? [
                'is_verified' => (bool) $teacher->teacherProfile->is_verified,
                'bio' => $teacher->teacherProfile->bio,
                'years_of_experience' => $teacher->teacherProfile->years_of_experience,
                'teaching_subjects' => $teacher->teacherProfile->teaching_subjects,
                'specialization' => $teacher->teacherProfile->specialization,
                'total_sessions_taught' => $teacher->teacherProfile->total_sessions_taught ?? 0,
                'overall_rating' => $teacher->teacherProfile->overall_rating ?? 4.9,
                'total_reviews' => $teacher->teacherProfile->total_reviews ?? 0,
                'wallet_balance' => $financialData['wallet_balance'],
                'total_earned' => $financialData['total_earned'],
                'pending_payouts' => $financialData['pending_payouts'],
            ] : [
                'is_verified' => false,
                'wallet_balance' => 0,
                'total_earned' => 0,
                'pending_payouts' => 0,
                'total_sessions_taught' => 0,
                'overall_rating' => 4.9,
                'total_reviews' => 0,
            ];
            
            // Format the request data for the frontend
            $formattedRequest = [
                'id' => $request->id,
                'teacher_id' => $request->teacher_id,
                'status' => $request->status,
                'video_status' => $request->video_status,
                'scheduled_date' => $request->scheduled_date,
                'meeting_link' => $request->meeting_link,
                'video_platform' => $request->video_platform,
                'created_at' => $request->created_at,
                'reviewed_by' => $request->reviewed_by,
                'reviewed_at' => $request->reviewed_at,
                'reviewer' => $request->reviewer ? [
                    'id' => $request->reviewer->id,
                    'name' => $request->reviewer->name,
                ] : null,
                'teacher' => array_merge($teacher->toArray(), [
                    'avatar' => $teacher->avatar ? $teacher->avatar : null,
                    'subject' => $teacher->teacherProfile ? implode(', ', (array)$teacher->teacherProfile->teaching_subjects) : 'Quran, Islamic Education',
                    'education' => 'BSc (Honours), Quran Recitation',
                    'rating' => $teacher->teacherProfile ? $teacher->teacherProfile->overall_rating : 4.9,
                    'reviews_count' => $teacher->teacherProfile ? $teacher->teacherProfile->total_reviews : 230,
                    'hourly_rate' => $teacher->teacherProfile ? $teacher->teacherProfile->hourly_rate : 25,
                    'phone' => $teacher->phone_number ?? '+1234567890'
                ]),
                'teacherProfile' => $teacherProfileData,
                'documents' => $request->documents->map(function($doc) {
                    return [
                        'id' => $doc->id,
                        'document_type' => $doc->document_type,
                        'file_path' => $doc->getFileUrl(),
                        'verification_status' => $doc->verification_status,
                    ];
                }),
            ];
            
            return Inertia::render('admin/verification-details', [
                'request' => $formattedRequest
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.verification-requests')
                ->with('error', 'Failed to load verification request: ' . $e->getMessage());
        }
    }

    /**
     * Display a listing of verification requests
     */
    public function index(Request $request)
    {
        try {
            $query = VerificationRequest::with(['teacher' => function($query) {
                $query->select('id', 'name', 'email', 'avatar', 'location', 'status');
            }, 'teacher.teacherProfile', 'documents']);
            
            // Apply filters
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->whereHas('teacher', function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            }
            
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('date') && !empty($request->date)) {
                $date = $request->date;
                $query->whereDate('created_at', $date);
            }
            
            // Paginate the results
            $perPage = 10; // Number of items per page
            $requests = $query->orderBy('created_at', 'desc')
                ->paginate($perPage)
                ->through(function($request) {
                    // Get financial data for each teacher
                    $financialData = $this->financeService->getFinancialSummary($request->teacher);
                    
                    // Format teacher profile data
                    $teacherProfileData = $request->teacher->teacherProfile ? [
                        'is_verified' => (bool) $request->teacher->teacherProfile->is_verified,
                        'wallet_balance' => $financialData['wallet_balance'],
                        'total_earned' => $financialData['total_earned'],
                        'pending_payouts' => $financialData['pending_payouts'],
                    ] : [
                        'is_verified' => false,
                        'wallet_balance' => 0,
                        'total_earned' => 0,
                        'pending_payouts' => 0,
                    ];
                    
                    return [
                        'id' => $request->id,
                        'teacher_id' => $request->teacher_id,
                        'status' => $request->status,
                        'video_status' => $request->video_status,
                        'scheduled_date' => $request->scheduled_date,
                        'meeting_link' => $request->meeting_link,
                        'video_platform' => $request->video_platform,
                        'created_at' => $request->created_at,
                        'teacher' => array_merge($request->teacher->toArray(), [
                            'avatar' => $request->teacher->avatar ? $request->teacher->avatar : null
                        ]),
                        'teacherProfile' => $teacherProfileData,
                        'documents' => $request->documents->map(function($doc) {
                            return [
                                'id' => $doc->id,
                                'document_type' => $doc->document_type,
                                'file_path' => $doc->getFileUrl(),
                                'verification_status' => $doc->verification_status,
                            ];
                        }),
                    ];
                });
            
            // Return Inertia view with data
            return Inertia::render('admin/verification', [
                'requests' => $requests->items(),
                'pagination' => [
                    'total' => $requests->total(),
                    'perPage' => $requests->perPage(),
                    'currentPage' => $requests->currentPage(),
                    'lastPage' => $requests->lastPage(),
                ],
                'filters' => [
                    'search' => $request->search ?? '',
                    'status' => $request->status ?? 'all',
                    'date' => $request->date ?? '',
                ]
            ]);
        } catch (\Exception $e) {
            // For web requests, return the view but with error
            return Inertia::render('admin/verification', [
                'requests' => [],
                'pagination' => [
                    'total' => 0,
                    'perPage' => 10,
                    'currentPage' => 1,
                    'lastPage' => 1,
                ],
                'filters' => [
                    'search' => $request->search ?? '',
                    'status' => $request->status ?? 'all',
                    'date' => $request->date ?? '',
                ],
                'error' => 'Failed to load verification requests: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Verify a teacher's verification request
     */
    public function verify($id)
    {
        try {
            $request = VerificationRequest::findOrFail($id);
            
            if ($request->status !== VerificationRequest::STATUS_PENDING) {
                return back()->with('error', 'This request has already been processed');
            }

            $request->approve(Auth::id());
            
            return redirect()->route('admin.verification-requests')->with('success', 'Verification request approved successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve verification request: ' . $e->getMessage());
        }
    }

    /**
     * Reject a teacher's verification request
     */
    public function reject(Request $request, $id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            if ($verificationRequest->status !== VerificationRequest::STATUS_PENDING) {
                return back()->with('error', 'This request has already been processed');
            }

            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500',
            ]);

            $verificationRequest->reject(Auth::id(), $validated['rejection_reason']);
            
            return redirect()->route('admin.verification-requests')->with('success', 'Verification request rejected successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reject verification request: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for scheduling a video verification call
     */
    public function scheduleForm($id)
    {
        // Redirect to the verification details page since we now use a dialog
        return redirect()->route('admin.verification-requests.show', ['id' => $id]);
    }

    /**
     * Schedule a video verification call
     */
    public function scheduleCall(Request $request, $id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            $validated = $request->validate([
                'scheduled_date' => 'required|date|after:now',
                'video_platform' => 'required|string|max:50',
                'meeting_link' => 'required|string|max:255',
                'meeting_notes' => 'nullable|string|max:500',
            ]);

            $verificationRequest->update([
                'status' => VerificationRequest::STATUS_PENDING,
                'video_status' => VerificationRequest::VIDEO_SCHEDULED,
                'scheduled_date' => $validated['scheduled_date'],
                'video_platform' => $validated['video_platform'],
                'meeting_link' => $validated['meeting_link'],
                'meeting_notes' => $validated['meeting_notes'],
            ]);

            // TODO: Send notification to teacher about scheduled call

            return redirect()->route('admin.verification-requests')->with('success', 'Video verification call scheduled successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to schedule video call: ' . $e->getMessage());
        }
    }

    /**
     * Mark a video verification call as completed
     */
    public function completeVideoCall($id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            if ($verificationRequest->video_status !== VerificationRequest::VIDEO_SCHEDULED) {
                return back()->with('error', 'This call is not scheduled');
            }

            $verificationRequest->update([
                'status' => VerificationRequest::STATUS_LIVE_VIDEO,
                'video_status' => VerificationRequest::VIDEO_COMPLETED,
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

            return redirect()->route('admin.verification-requests')->with('success', 'Video verification call marked as completed');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to mark call as completed: ' . $e->getMessage());
        }
    }

    /**
     * Mark a video verification call as missed
     */
    public function missedVideoCall($id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            if ($verificationRequest->video_status !== VerificationRequest::VIDEO_SCHEDULED) {
                return back()->with('error', 'This call is not scheduled');
            }

            $verificationRequest->update([
                'status' => VerificationRequest::STATUS_PENDING,
                'video_status' => VerificationRequest::VIDEO_MISSED,
            ]);

            return redirect()->route('admin.verification-requests')->with('success', 'Video verification call marked as missed');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to mark call as missed: ' . $e->getMessage());
        }
    }

    /**
     * Set verification request to live video status
     */
    public function setLiveVideo($id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            if ($verificationRequest->status !== VerificationRequest::STATUS_PENDING) {
                return back()->with('error', 'Only pending requests can be set to live video status');
            }

            $verificationRequest->setLiveVideo(Auth::id());

            return redirect()->route('admin.verification-requests')->with('success', 'Verification request set to live video status');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to set live video status: ' . $e->getMessage());
        }
    }
} 