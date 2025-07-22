<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\TeachingSession;

class DashboardController extends Controller
{
    /**
     * Display the student dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $studentProfile = $user->studentProfile;
        $userId = $user->id;

        // Get student stats from database
        $stats = [
            'totalClasses' => TeachingSession::forStudent($userId)->count(),
            'completedClasses' => TeachingSession::forStudent($userId)->completed()->count(),
            'upcomingClasses' => TeachingSession::forStudent($userId)->upcoming()->count(),
        ];

        // Get recent activities (example, replace with actual queries)
        $recentActivities = [
            [
                'id' => 1,
                'type' => 'lesson',
                'title' => 'Completed Tajweed Lesson',
                'date' => Carbon::now()->subDays(2)->toDateTimeString(),
            ],
            [
                'id' => 2,
                'type' => 'assignment',
                'title' => 'Assignment Submitted',
                'date' => Carbon::now()->subDays(5)->toDateTimeString(),
            ],
        ];

        // Get upcoming classes from the database
        $upcomingClasses = TeachingSession::forStudent($userId)
            ->upcoming()
            ->with(['teacher:id,name', 'subscriptionPlan:id,name,image'])
            ->orderBy('scheduled_start_time', 'asc')
            ->take(5)
            ->get()
            ->map(function($session) {
                $startTime = new Carbon($session->scheduled_start_time);
                $endTime = new Carbon($session->scheduled_end_time);
                
                return [
                    'id' => $session->id,
                    'title' => $session->subject . ($session->session_topic ? ' - ' . $session->session_topic : ''),
                    'teacher' => $session->teacher->name,
                    'date' => $startTime->format('l, F j, Y'),
                    'timeRange' => $startTime->format('g:i A') . ' - ' . $endTime->format('g:i A'),
                    'status' => $this->mapSessionStatus($session->status),
                    'image' => $session->image // Uses the getImageAttribute accessor
                ];
            });

        return Inertia::render('dashboards/student', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'upcomingClasses' => $upcomingClasses,
        ]);
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
}
