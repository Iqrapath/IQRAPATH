<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\Schedule;
use App\Models\Rating;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\DocumentUpload;
use App\Models\TeachingSession;
use App\Services\TeacherFinanceService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\PayoutRequest;
use Illuminate\Support\Facades\Auth;

class TeacherManagementController extends Controller
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
     * Display a listing of teachers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'teacher');
        
        // Apply filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('teaching_subject') && $request->input('teaching_subject') !== 'all') {
            $subject = $request->input('teaching_subject');
            $query->whereHas('teacherProfile.subjects', function ($q) use ($subject) {
                $q->where('name', $subject);
            });
        }
        
        if ($request->has('rating') && $request->input('rating') !== 'all') {
            $rating = $request->input('rating');
            $query->whereHas('teacherProfile', function ($q) use ($rating) {
                $q->where('overall_rating', '>=', $rating);
            });
        }
        
        // Get paginated results
        $teachers = $query->with(['teacherProfile.subjects'])->paginate(10);
        
        // Format teachers data for frontend
        $formattedTeachers = $teachers->map(function ($teacher) {
            $subjects = $teacher->teacherProfile ? $teacher->teacherProfile->subjects->pluck('name')->toArray() : [];
            
            return [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'avatar' => $teacher->avatar,
                'teaching_subjects' => $subjects,
                'rating' => $teacher->teacherProfile ? ($teacher->teacherProfile->overall_rating ?? 0) : 0,
                'classesHeld' => $teacher->teacherProfile ? ($teacher->teacherProfile->total_sessions_taught ?? 0) : 0,
                'status' => $teacher->status ? ucfirst($teacher->status) : 'Not specified',
            ];
        });
        
        // Get available subjects for filtering
        $availableSubjects = $this->getAvailableSubjects();
        
        // Get available statuses for filtering
        $availableStatuses = $this->getAvailableStatuses();
        
        // Get available ratings for filtering
        $availableRatings = $this->getAvailableRatings();

        return Inertia::render('admin/teachers', [
            'teachers' => $formattedTeachers,
            'pagination' => [
                'total' => $teachers->total(),
                'perPage' => $teachers->perPage(),
                'currentPage' => $teachers->currentPage(),
                'lastPage' => $teachers->lastPage(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
                'teaching_subject' => $request->input('teaching_subject', 'all'),
                'rating' => $request->input('rating', 'all'),
            ],
            'availableSubjects' => $availableSubjects,
            'availableStatuses' => $availableStatuses,
            'availableRatings' => $availableRatings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ],
        ]);
    }
    
    /**
     * Get available subjects from the database
     */
    private function getAvailableSubjects(): array
    {
        return \App\Models\Subject::where('is_active', true)
            ->orderBy('name')
            ->pluck('name')
            ->toArray();
    }
    
    /**
     * Get available statuses from the database
     */
    private function getAvailableStatuses(): array
    {
        $statuses = User::where('role', 'teacher')
            ->distinct()
            ->pluck('status')
            ->filter()
            ->map(function($status) {
                return ucfirst($status);
            })
            ->toArray();
            
        // Ensure we always have these standard statuses
        $standardStatuses = ['Active', 'Pending', 'Inactive', 'Suspended'];
        
        foreach ($standardStatuses as $status) {
            if (!in_array($status, $statuses)) {
                $statuses[] = $status;
            }
        }
        
        sort($statuses);
        return $statuses;
    }
    
    /**
     * Get available ratings for filtering
     */
    private function getAvailableRatings(): array
    {
        // Get distinct rating values from the database
        $distinctRatings = TeacherProfile::distinct()
            ->whereNotNull('overall_rating')
            ->orderBy('overall_rating', 'desc')
            ->pluck('overall_rating')
            ->toArray();
            
        // Create standardized rating options
        $ratingOptions = [
            ['value' => '5', 'label' => '5 Stars'],
            ['value' => '4', 'label' => '4+ Stars'],
            ['value' => '3', 'label' => '3+ Stars'],
        ];
        
        // Add any additional ratings from the database
        foreach ($distinctRatings as $rating) {
            $roundedRating = floor($rating);
            if ($roundedRating < 3 && !in_array($roundedRating, array_column($ratingOptions, 'value'))) {
                $ratingOptions[] = [
                    'value' => (string)$roundedRating,
                    'label' => $roundedRating . '+ Stars'
                ];
            }
        }
        
        // Sort by value descending
        usort($ratingOptions, function($a, $b) {
            return $b['value'] <=> $a['value'];
        });
        
        return $ratingOptions;
    }

    /**
     * Store a newly created teacher in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate user data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'role' => 'required|in:teacher',
            'status' => 'required|in:active,inactive,pending,suspended',
            'registration_date' => 'nullable|date',
            
            // Teacher profile validation
            'bio' => 'nullable|string',
            'years_of_experience' => 'nullable|integer|min:0',
            'teaching_subjects' => 'nullable',
            'specialization' => 'nullable|string|max:255',
            'teaching_type' => 'nullable|string|in:online,in-person,both',
            'teaching_mode' => 'nullable|string|in:full-time,part-time',
            'teaching_languages' => 'nullable',
            
            // Document validation
            'id_type' => 'nullable|string|max:255',
            'certificate_name' => 'nullable|string|max:255',
            'certificate_institution' => 'nullable|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'id_front' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'id_back' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'certificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'resume' => 'nullable|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:5120',
            
            // Availability validation
            'availability_schedule' => 'nullable',
        ]);

        DB::beginTransaction();
        
        try {
            // Create user with default password
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone_number = $request->phone_number;
            $user->location = $request->location;
            $user->role = 'teacher';
            $user->status = $request->status;
            $user->registration_date = $request->registration_date;
            $user->password = bcrypt('password'); // Default password, should be changed on first login
            $user->save();
            
            // Create teacher profile
            $profile = new TeacherProfile();
            $profile->user_id = $user->id;
            $profile->bio = $request->bio;
            $profile->years_of_experience = $request->years_of_experience;
            $profile->specialization = $request->specialization;
            $profile->teaching_type = $request->teaching_type;
            $profile->teaching_mode = $request->teaching_mode;
            
            // Handle teaching_languages - ensure it's properly formatted as an array
            if ($request->has('teaching_languages')) {
                $languages = $request->teaching_languages;
                if (is_string($languages)) {
                    try {
                        $languages = json_decode($languages, true);
                    } catch (\Exception $e) {
                        $languages = explode(',', $languages);
                    }
                }
                if (is_array($languages)) {
                    $languages = array_filter($languages, function($lang) {
                        return !empty(trim($lang));
                    });
                }
                $profile->teaching_languages = $languages;
            } else {
                $profile->teaching_languages = [];
            }
            
            $profile->is_verified = false;
            $profile->save();
            
            // Add subjects to the teacher profile if provided
            if ($request->has('teaching_subjects')) {
                // Debug the teaching_subjects data
                Log::info('Teaching subjects data:', [
                    'raw_data' => $request->teaching_subjects,
                    'is_array' => is_array($request->teaching_subjects),
                    'is_string' => is_string($request->teaching_subjects),
                    'user_id' => $user->id,
                    'profile_id' => $profile->id
                ]);
                
                // Parse the teaching_subjects data if it's a JSON string
                $subjectsData = $request->teaching_subjects;
                if (is_string($subjectsData)) {
                    try {
                        $subjectsData = json_decode($subjectsData, true);
                        Log::info('Parsed teaching subjects:', [
                            'parsed_data' => $subjectsData,
                            'is_array' => is_array($subjectsData),
                            'count' => is_array($subjectsData) ? count($subjectsData) : 0
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error parsing teaching subjects:', [
                            'error' => $e->getMessage()
                        ]);
                        // If JSON parsing fails, try to split by comma
                        $subjectsData = explode(',', $subjectsData);
                        Log::info('Fallback to comma-split:', [
                            'subjects' => $subjectsData
                        ]);
                    }
                }
                
                // Ensure we have an array to work with
                if (is_array($subjectsData)) {
                    // Filter out empty subjects
                    $subjectsData = array_filter($subjectsData, function($subject) {
                        return !empty(trim($subject));
                    });
                    
                    Log::info('Filtered subjects data:', [
                        'subjects' => $subjectsData
                    ]);
                    
                    foreach ($subjectsData as $index => $subjectName) {
                        // Skip empty subjects
                        if (empty(trim($subjectName))) {
                            continue;
                        }
                        
                        // Find or create the subject
                        $subject = \App\Models\Subject::firstOrCreate(
                            ['name' => $subjectName],
                            ['is_active' => true]
                        );
                        
                        // Attach the subject to the teacher profile
                        $profile->subjects()->attach($subject->id, [
                            'is_primary' => ($index === 0), // First subject is primary
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                        
                        Log::info('Subject attached:', [
                            'subject_name' => $subjectName,
                            'subject_id' => $subject->id,
                            'is_primary' => ($index === 0)
                        ]);
                    }
                } else {
                    Log::warning('Teaching subjects data is not an array after processing', [
                        'data' => $subjectsData
                    ]);
                }
            }
            
            // Process document uploads
            $this->processDocumentUploads($request, $user->id);
            
            // Process availability schedule
            $this->processAvailabilitySchedule($request, $user->id);
            
            DB::commit();
            
            // Reload the user with teacherProfile and subjects to ensure they are available in the response
            $user = User::with(['teacherProfile.subjects'])->find($user->id);
            
            // Add more detailed logging to diagnose the issue
            Log::info('Teacher before formatting response:', [
                'teacher_id' => $user->id,
                'has_profile' => $user->teacherProfile ? true : false,
                'subjects_count' => $user->teacherProfile ? $user->teacherProfile->subjects->count() : 0,
                'subjects' => $user->teacherProfile ? $user->teacherProfile->subjects->toArray() : []
            ]);
            
            // Get the teaching subjects from the relationship
            $teachingSubjects = [];
            if ($user->teacherProfile && $user->teacherProfile->subjects) {
                $teachingSubjects = $user->teacherProfile->subjects->pluck('name')->toArray();
            }
            
            // Format the response data to match what the frontend expects
            $formattedTeacher = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'teaching_subjects' => $teachingSubjects,
                'rating' => 0,
                'classesHeld' => 0,
                'status' => ucfirst($user->status),
            ];
            
            // Log the formatted teacher data
            Log::info('Formatted teacher response:', [
                'teaching_subjects' => $formattedTeacher['teaching_subjects']
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Teacher created successfully',
                'teacher' => $formattedTeacher
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating teacher: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create teacher: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Process document uploads for a teacher.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teacherId
     * @return void
     */
    private function processDocumentUploads(Request $request, $teacherId)
    {
        $documentTypes = [
            'id_front' => 'id_front',
            'id_back' => 'id_back',
            'certificate' => 'certificate',
            'resume' => 'resume'
        ];
        
        foreach ($documentTypes as $requestKey => $documentType) {
            if ($request->hasFile($requestKey)) {
                $file = $request->file($requestKey);
                $path = $file->store('teacher_documents/' . $teacherId, 'public');
                
                $document = new DocumentUpload();
                $document->teacher_id = $teacherId;
                $document->document_type = $documentType;
                $document->id_type = $documentType === 'id_front' || $documentType === 'id_back' ? $request->id_type : null;
                $document->certificate_name = $documentType === 'certificate' ? $request->certificate_name : null;
                $document->certificate_institution = $documentType === 'certificate' ? $request->certificate_institution : null;
                $document->issue_date = $request->issue_date;
                $document->expiry_date = $request->expiry_date;
                $document->file_path = $path;
                $document->file_name = $file->getClientOriginalName();
                $document->file_type = $file->getClientMimeType();
                $document->file_size = $file->getSize() / 1024; // Convert to KB
                $document->verification_status = 'pending';
                $document->save();
            }
        }
    }
    
    /**
     * Process availability schedule for a teacher.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $teacherId
     * @return void
     */
    private function processAvailabilitySchedule(Request $request, $teacherId)
    {
        if ($request->has('availability_schedule')) {
            $schedule = json_decode($request->availability_schedule, true);
            
            if (is_array($schedule)) {
                foreach ($schedule as $timeSlot) {
                    if (isset($timeSlot['isSelected']) && $timeSlot['isSelected'] && 
                        isset($timeSlot['day']) && isset($timeSlot['fromTime']) && isset($timeSlot['toTime'])) {
                        
                        Schedule::create([
                            'user_id' => $teacherId,
                            'user_role' => 'teacher',
                            'day_of_week' => strtolower($timeSlot['day']),
                            'start_time' => $timeSlot['fromTime'],
                            'end_time' => $timeSlot['toTime'],
                            'is_available' => true
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Display the specified teacher.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $teacher = User::where('role', 'teacher')
            ->with(['teacherProfile.subjects', 'ratingsReceived', 'teachingSessions'])
            ->findOrFail($id);
        
        // Get teacher profile
        $profile = $teacher->teacherProfile;
        
        // Debug subjects
        \Illuminate\Support\Facades\Log::info('Teacher subjects', [
            'teacher_id' => $teacher->id,
            'has_profile' => $profile ? true : false,
            'subjects_count' => $profile ? $profile->subjects->count() : 0,
            'subjects' => $profile ? $profile->subjects->toArray() : []
        ]);
        
        // Get teacher's schedule/availability
        $schedules = Schedule::where('user_id', $teacher->id)
            ->where('user_role', 'teacher')
            ->get();
            
        // Format schedules for frontend
        $formattedSchedules = $schedules->groupBy('day_of_week')
            ->map(function ($daySchedules) {
                return $daySchedules->map(function ($schedule) {
                    return [
                        'id' => $schedule->id,
                        'start_time' => $schedule->getFormattedStartTime(),
                        'end_time' => $schedule->getFormattedEndTime(),
                        'is_available' => $schedule->is_available,
                    ];
                });
            })
            ->toArray();
            
        // Get financial data using the finance service
        $financialData = $this->financeService->getFinancialSummary($teacher);
        
        // Format teacher data for frontend
        $teacherData = [
            'id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'avatar' => $teacher->avatar ?? '/assets/images/teachers/default.png',
            'phone' => $teacher->phone_number,
            'location' => $teacher->location,
            'status' => $teacher->status,
            'registrationDate' => $teacher->created_at,
            'role' => $teacher->role,
            'sessionsTaught' => $teacher->teachingSessions->count(),
            'totalHours' => $teacher->teachingSessions->sum('duration') / 60, // Convert minutes to hours
        ];
        
        // Format profile data
        $profileData = $profile ? [
            'bio' => $profile->bio,
            'experience' => $profile->years_of_experience,
            'subjects' => $profile->subjects->map(function($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'pivot' => [
                        'is_primary' => $subject->pivot->is_primary
                    ]
                ];
            })->values()->toArray(),
            'teaching_subjects' => $profile->subjects->pluck('name')->toArray(),
            'subject' => $profile->subjects->pluck('name')->toArray(), // For backward compatibility
            'specialization' => $profile->specialization,
            'teaching_type' => $profile->teaching_type,
            'teaching_mode' => $profile->teaching_mode,
            'teaching_languages' => $profile->teaching_languages,
            'hourlyRate' => $profile->hourly_rate,
            'currency' => $profile->currency,
            'amountPerSession' => $profile->amount_per_session,
            'is_verified' => $profile->is_verified,
            'verification_status' => $profile->is_verified ? 'approved' : 'pending',
            'wallet_balance' => $financialData['wallet_balance'],
            'total_earned' => $financialData['total_earned'],
            'pending_payouts' => $financialData['pending_payouts'],
            'availability_schedule' => $profile->availability_schedule,
        ] : null;
        
        // Get upcoming sessions
        $upcomingSessions = TeachingSession::where('teacher_id', $teacher->id)
            ->where('status', 'scheduled')
            ->where('scheduled_start_time', '>', now())
            ->with('student:id,name')
            ->orderBy('scheduled_start_time')
            ->take(5)
            ->get()
            ->map(function ($session) {
                return [
                    'student' => $session->student->name,
                    'date' => $session->scheduled_start_time->format('Y-m-d'),
                    'time' => $session->scheduled_start_time->format('H:i')
                ];
            });
            
        // Get documents
        $idVerification = DocumentUpload::where('user_id', $teacher->id)
            ->where('user_role', 'teacher')
            ->where('document_type', 'id_front')
            ->first();
            
        $certificates = DocumentUpload::where('user_id', $teacher->id)
            ->where('user_role', 'teacher')
            ->where('document_type', 'certificate')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'name' => $cert->certificate_name ?? 'Certificate',
                    'image' => $cert->file_path,
                    'uploaded' => true
                ];
            });
            
        $resume = DocumentUpload::where('user_id', $teacher->id)
            ->where('user_role', 'teacher')
            ->where('document_type', 'resume')
            ->first();
            
        $documents = [
            'idVerification' => [
                'uploaded' => $idVerification ? true : false,
                'idType' => $idVerification ? $idVerification->id_type : null,
                'frontImage' => $idVerification ? $idVerification->file_path : null,
                'backImage' => null // Assuming back image is stored separately or not at all
            ],
            'certificates' => $certificates->count() ? $certificates : [
                ['id' => 0, 'name' => 'No certificates uploaded', 'image' => null, 'uploaded' => false]
            ],
            'resume' => [
                'uploaded' => $resume ? true : false,
                'file' => $resume ? $resume->file_path : null
            ]
        ];
        
        return Inertia::render('admin/teacher-details', [
            'teacher' => $teacherData,
            'upcomingSessions' => $upcomingSessions,
            'documents' => $documents
        ]);
    }
    
    /**
     * Approve a teacher.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve($id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Update teacher profile verification status
        if ($teacher->teacherProfile) {
            $teacher->teacherProfile->is_verified = true;
            $teacher->teacherProfile->save();
        }
        
        // Update teacher status to active
        $teacher->status = 'active';
        $teacher->save();
        
        return redirect()->back()->with('success', 'Teacher approved successfully');
    }
    
    /**
     * Reject a teacher.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Update teacher profile verification status
        if ($teacher->teacherProfile) {
            $teacher->teacherProfile->is_verified = false;
            $teacher->teacherProfile->save();
        }
        
        // Update teacher status to rejected
        $teacher->status = 'inactive';
        $teacher->save();
        
        return redirect()->back()->with('success', 'Teacher rejected successfully');
    }
    
    /**
     * Send message to a teacher.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendMessage(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Validate request
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);
        
        // TODO: Implement message sending functionality
        // This could be through email, in-app notification, or a messages table
        
        return redirect()->back()->with('success', 'Message sent to teacher successfully');
    }
    
    /**
     * Delete a teacher account.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Delete the user (and related data through cascade)
        $teacher->delete();
        
        return redirect()->route('admin.teachers.index')->with('success', 'Teacher account deleted successfully');
    }
    
    /**
     * Update teacher status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Update teacher status
        $teacher->status = $request->status;
        $teacher->save();
        
        return redirect()->back()->with('success', 'Teacher status updated successfully');
    }
    
    /**
     * Update teacher profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Debug the request data
        Log::info('Teacher profile update request:', [
            'request_data' => $request->all(),
            'has_availability_schedule' => $request->has('profile.availability_schedule'),
        ]);
        
        // Validate request
        $validated = $request->validate([
            'profile.bio' => 'sometimes|string',
            'profile.experience' => 'sometimes|integer',
            'profile.subjects' => 'sometimes|array',
            'profile.teaching_subjects' => 'sometimes|array',
            'profile.specialization' => 'sometimes|string|max:255',
            'profile.teaching_type' => 'sometimes|string|max:255',
            'profile.teaching_mode' => 'sometimes|string|max:255',
            'profile.teaching_languages' => 'sometimes|array',
            'profile.availability_schedule' => 'sometimes|array',
        ]);
        
        // Get teacher profile
        $profile = $teacher->teacherProfile;
        
        if ($profile) {
            // Update profile fields
            if (isset($validated['profile']['bio'])) $profile->bio = $validated['profile']['bio'];
            if (isset($validated['profile']['experience'])) $profile->years_of_experience = $validated['profile']['experience'];
            
            // Handle both subjects and teaching_subjects fields
            if (isset($validated['profile']['subjects']) || isset($validated['profile']['teaching_subjects'])) {
                // Get the subjects data from either field
                $subjectsData = isset($validated['profile']['subjects']) 
                    ? $validated['profile']['subjects'] 
                    : $validated['profile']['teaching_subjects'];
                
                // Debug the subjects data
                Log::info('Update profile subjects data:', [
                    'raw_data' => $subjectsData,
                    'is_array' => is_array($subjectsData),
                    'is_string' => is_string($subjectsData)
                ]);
                
                // Parse the subjects data if it's a JSON string
                if (is_string($subjectsData)) {
                    try {
                        $subjectsData = json_decode($subjectsData, true);
                        Log::info('Parsed update profile subjects:', [
                            'parsed_data' => $subjectsData,
                            'is_array' => is_array($subjectsData)
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error parsing update profile subjects:', [
                            'error' => $e->getMessage()
                        ]);
                    }
                }
                
                // Check if we're using the subjects relationship
                if (method_exists($profile, 'subjects')) {
                    // Clear existing subject relationships
                    $profile->subjects()->detach();
                    
                    // Add new subjects
                    if (is_array($subjectsData) && count($subjectsData) > 0) {
                        foreach ($subjectsData as $index => $subjectName) {
                            // Skip empty subjects
                            if (empty(trim($subjectName))) {
                                continue;
                            }
                            
                            // Find or create the subject
                            $subject = \App\Models\Subject::firstOrCreate(
                                ['name' => $subjectName],
                                ['is_active' => true]
                            );
                            
                            // Attach the subject to the teacher profile
                            $profile->subjects()->attach($subject->id, [
                                'is_primary' => ($index === 0), // First subject is primary
                                'created_at' => now(),
                                'updated_at' => now()
                            ]);
                            
                            Log::info('Subject attached in update profile:', [
                                'subject_name' => $subjectName,
                                'subject_id' => $subject->id,
                                'is_primary' => ($index === 0)
                            ]);
                        }
                    }
                } else {
                    // Fallback to using teaching_subjects field
                    $profile->teaching_subjects = $subjectsData;
                }
            }
            
            if (isset($validated['profile']['specialization'])) $profile->specialization = $validated['profile']['specialization'];
            if (isset($validated['profile']['teaching_type'])) $profile->teaching_type = $validated['profile']['teaching_type'];
            if (isset($validated['profile']['teaching_mode'])) $profile->teaching_mode = $validated['profile']['teaching_mode'];
            if (isset($validated['profile']['teaching_languages'])) {
                // Ensure teaching_languages is stored as a clean array
                $languages = $validated['profile']['teaching_languages'];
                // Filter out empty values
                if (is_array($languages)) {
                    $languages = array_filter($languages, function($lang) {
                        return !empty(trim($lang));
                    });
                }
                $profile->teaching_languages = $languages;
            }
            if (isset($validated['profile']['availability_schedule'])) {
                Log::info('Saving availability_schedule: ', [
                    'data' => $validated['profile']['availability_schedule']
                ]);
                $profile->availability_schedule = $validated['profile']['availability_schedule'];
            }
            
            $profile->save();
        }
        
        // Check if the request is an XHR/AJAX request
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Teacher profile updated successfully'
            ]);
        }
        
        // Return a redirect response with a flash message for regular requests
        return redirect()->back()->with('success', 'Teacher profile updated successfully');
    }
    
    /**
     * Upload teacher document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadDocument(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Validate request
        $validated = $request->validate([
            'document_type' => 'required|in:id_front,id_back,certificate,resume',
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:5120', // 5MB max
            'id_type' => 'nullable|string|required_if:document_type,id_front,id_back',
            'certificate_name' => 'nullable|string|required_if:document_type,certificate',
            'certificate_institution' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:issue_date',
        ]);
        
        // Handle file upload
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        
        // Create path based on document type
        $path = 'teacher_documents/' . $teacher->id . '/' . $validated['document_type'];
        $filePath = $file->storeAs($path, $filename, 'public');
        
        // Create document record
        $document = new DocumentUpload();
        $document->teacher_id = $teacher->id;
        $document->document_type = $validated['document_type'];
        $document->file_path = $filePath;
        $document->file_name = $filename;
        $document->file_type = $file->getMimeType();
        $document->file_size = $file->getSize();
        $document->verification_status = 'pending';
        
        // Set additional fields based on document type
        if (in_array($validated['document_type'], ['id_front', 'id_back'])) {
            $document->id_type = $validated['id_type'] ?? null;
        } elseif ($validated['document_type'] === 'certificate') {
            $document->certificate_name = $validated['certificate_name'] ?? null;
            $document->certificate_institution = $validated['certificate_institution'] ?? null;
        }
        
        // Set dates if provided
        if (isset($validated['issue_date'])) {
            $document->issue_date = $validated['issue_date'];
        }
        
        if (isset($validated['expiry_date'])) {
            $document->expiry_date = $validated['expiry_date'];
        }
        
        $document->save();
        
        // Return success response with document details
        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'document' => [
                'id' => $document->id,
                'type' => $document->document_type,
                'file_path' => $document->file_path,
                'file_url' => $document->getFileUrl(),
                'verification_status' => $document->verification_status
            ]
        ]);
    }
    
    /**
     * Get teacher documents.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDocuments($id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Get ID documents
        $idFront = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'id_front')
            ->latest()
            ->first();
            
        $idBack = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'id_back')
            ->latest()
            ->first();
            
        // Get certificates
        $certificates = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'certificate')
            ->latest()
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'name' => $cert->certificate_name ?? 'Certificate',
                    'image' => $cert->file_path,
                    'url' => $cert->getFileUrl(),
                    'institution' => $cert->certificate_institution,
                    'issue_date' => $cert->issue_date,
                    'verification_status' => $cert->verification_status,
                    'uploaded' => true
                ];
            });
            
        // Get resume
        $resume = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'resume')
            ->latest()
            ->first();
            
        // Format response
        $documents = [
            'idVerification' => [
                'uploaded' => ($idFront || $idBack) ? true : false,
                'idType' => $idFront ? $idFront->id_type : null,
                'frontImage' => $idFront ? $idFront->file_path : null,
                'frontUrl' => $idFront ? $idFront->getFileUrl() : null,
                'frontVerificationStatus' => $idFront ? $idFront->verification_status : null,
                'frontId' => $idFront ? $idFront->id : null,
                'backImage' => $idBack ? $idBack->file_path : null,
                'backUrl' => $idBack ? $idBack->getFileUrl() : null,
                'backVerificationStatus' => $idBack ? $idBack->verification_status : null,
                'backId' => $idBack ? $idBack->id : null
            ],
            'certificates' => $certificates->count() ? $certificates : [],
            'resume' => [
                'uploaded' => $resume ? true : false,
                'file' => $resume ? $resume->file_path : null,
                'url' => $resume ? $resume->getFileUrl() : null,
                'verification_status' => $resume ? $resume->verification_status : null,
                'id' => $resume ? $resume->id : null
            ]
        ];
        
        return response()->json([
            'success' => true,
            'documents' => $documents
        ]);
    }
    
    /**
     * Update teacher verification status based on document verification.
     *
     * @param  \App\Models\User  $teacher
     * @return void
     */
    private function updateTeacherVerificationStatus(User $teacher)
    {
        // Check if all required documents are verified
        $hasVerifiedIdFront = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'id_front')
            ->where('verification_status', 'verified')
            ->exists();
            
        $hasVerifiedIdBack = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'id_back')
            ->where('verification_status', 'verified')
            ->exists();
            
        $hasVerifiedCertificate = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', 'certificate')
            ->where('verification_status', 'verified')
            ->exists();
            
        // If all required documents are verified, set teacher profile to verified
        if ($hasVerifiedIdFront && $hasVerifiedIdBack && $hasVerifiedCertificate) {
            if ($teacher->teacherProfile) {
                $teacher->teacherProfile->is_verified = true;
                $teacher->teacherProfile->save();
            }
            
            // Also update teacher status to active if it was pending
            if ($teacher->status === 'pending') {
                $teacher->status = 'active';
                $teacher->save();
            }
        }
    }
    
    /**
     * Verify teacher document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyDocument(Request $request, $id, $documentId)
    {
        // Validate teacher exists
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Validate document exists and belongs to teacher
        $document = DocumentUpload::where('id', $documentId)
            ->where('teacher_id', $teacher->id)
            ->firstOrFail();
        
        // Validate request
        $validated = $request->validate([
            'verification_status' => 'required|in:verified,rejected',
            'verification_notes' => 'nullable|string|max:500',
        ]);
        
        // Update document
        $document->verification_status = $validated['verification_status'];
        $document->verification_notes = $validated['verification_notes'] ?? null;
        $document->verified_by = \Illuminate\Support\Facades\Auth::id();
        $document->verified_at = now();
        $document->save();
        
        // Update teacher verification status based on document status
        if ($validated['verification_status'] === 'verified') {
            $this->updateTeacherVerificationStatus($teacher);
        } else if ($validated['verification_status'] === 'rejected') {
            $this->updateTeacherRejectionStatus($teacher, $document);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Document verification status updated successfully',
            'document' => [
                'id' => $document->id,
                'verification_status' => $document->verification_status,
                'verified_at' => $document->verified_at
            ]
        ]);
    }
    
    /**
     * Update teacher status when a document is rejected.
     *
     * @param  \App\Models\User  $teacher
     * @param  \App\Models\DocumentUpload  $rejectedDocument
     * @return void
     */
    private function updateTeacherRejectionStatus(User $teacher, DocumentUpload $rejectedDocument)
    {
        // If it's a critical document like ID or certificate, mark teacher as not verified
        if (in_array($rejectedDocument->document_type, [
            'id_front',
            'id_back',
            'certificate'
        ])) {
            if ($teacher->teacherProfile) {
                $teacher->teacherProfile->is_verified = false;
                $teacher->teacherProfile->save();
            }
            
            // Optionally update teacher status to indicate rejection
            // Only change status if it was pending or active
            if (in_array($teacher->status, ['pending', 'active'])) {
                $teacher->status = 'pending';
                $teacher->save();
            }
        }
    }
    
    /**
     * Delete teacher document.
     *
     * @param  int  $id
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteDocument($id, $documentId)
    {
        // Validate teacher exists
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Validate document exists and belongs to teacher
        $document = DocumentUpload::where('id', $documentId)
            ->where('teacher_id', $teacher->id)
            ->firstOrFail();
        
        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        // Delete document record
        $document->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }

    /**
     * Show the teacher's earnings and transaction history.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function showEarnings($id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        
        // Get financial data using the finance service
        $financialData = $this->financeService->getFinancialSummary($teacher);
        
        // Get transactions for this teacher
        $transactions = $this->financeService->getTransactions($teacher->id);
        
        // Get payout requests for this teacher
        $payoutRequests = $this->financeService->getPayoutRequests($teacher->id);
        
        // Get payout requests for this teacher
        $monthlyEarnings = $this->financeService->getMonthlyEarnings($teacher->id);
        
        // Format teacher data for the frontend
        $teacherData = [
            'id' => $teacher->id,
            'name' => $teacher->name,
            'email' => $teacher->email,
            'avatar' => $teacher->avatar,
            'phone' => $teacher->phone_number,
            'location' => $teacher->location,
            'status' => $teacher->status,
            'registrationDate' => $teacher->created_at,
            'is_verified' => $teacher->teacherProfile ? $teacher->teacherProfile->is_verified : false
        ];
        
        // Format earnings data
        $earningsData = [
            'wallet_balance' => $financialData['wallet_balance'],
            'total_earned' => $financialData['total_earned'],
            'pending_payouts' => $financialData['pending_payouts'],
            'available_for_payout' => $financialData['available_for_payout'] ?? $financialData['wallet_balance'],
            'total_sessions' => $teacher->teacherProfile ? $teacher->teacherProfile->total_sessions_taught : 0,
            'transactions' => $transactions,
            'payout_requests' => $payoutRequests,
            'monthly_earnings' => $monthlyEarnings
        ];
        
        return Inertia::render('admin/teacher-earnings', [
            'teacher' => $teacherData,
            'earnings' => $earningsData
        ]);
    }

    /**
     * Process a payout for a teacher.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayout(Request $request, $id)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        $amount = $request->input('amount', 0);
        
        // Process the payout using the finance service
        $result = $this->financeService->processPayout($teacher, $amount);
        
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => 'Payout processed successfully',
                'transaction' => $result['transaction'] ?? null
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => $result['message'] ?? 'Failed to process payout',
        ], 400);
    }

    /**
     * Approve a payout request.
     *
     * @param  int  $id
     * @param  int  $requestId
     * @return \Illuminate\Http\JsonResponse
     */
    public function approvePayoutRequest($id, $requestId)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        $payoutRequest = PayoutRequest::where('id', $requestId)
            ->where('user_id', $teacher->id)
            ->where('status', 'pending')
            ->firstOrFail();
        
        $result = $this->financeService->processPayoutRequest(
            $payoutRequest, 
            Auth::user(), 
            'approved'
        );
        
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Payout request approved successfully'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to approve payout request'
        ], 500);
    }
    
    /**
     * Reject a payout request.
     *
     * @param  int  $id
     * @param  int  $requestId
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectPayoutRequest($id, $requestId)
    {
        $teacher = User::where('role', 'teacher')->findOrFail($id);
        $payoutRequest = PayoutRequest::where('id', $requestId)
            ->where('user_id', $teacher->id)
            ->where('status', 'pending')
            ->firstOrFail();
        
        $result = $this->financeService->processPayoutRequest(
            $payoutRequest, 
            Auth::user(), 
            'rejected'
        );
        
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Payout request rejected successfully'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to reject payout request'
        ], 500);
    }
} 