<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\StudentProfile;
use App\Models\Subscription;
use App\Models\TeachingSession;
use App\Models\DocumentUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        // Fetch stats data
        $statsData = [
            [
                'title' => "Total Teachers:",
                'value' => User::where('role', 'teacher')->count(),
                'icon' => $this->getTeacherIcon(),
                'gradient' => "from-[#ffff]/100 to-[#fff]/100"
            ],
            [
                'title' => "Active Students:",
                'value' => User::where('role', 'student')->where('status', 'active')->count(),
                'icon' => $this->getStudentIcon(),
                'gradient' => "from-[#E9FFFD]/100 to-[#fff]/100"
            ],
            [
                'title' => "Active Subscriptions:",
                'value' => Subscription::where('status', 'active')->count(),
                'icon' => $this->getSubscriptionIcon(),
                'gradient' => "from-[#C0B7E8]/100 to-[#fff]/100"
            ],
            [
                'title' => "Pending Verifications:",
                'value' => TeacherProfile::where('is_verified', false)->count(),
                'icon' => $this->getVerificationIcon(),
                'gradient' => "from-[#FFF9E9]/100 to-[#fff]/100"
            ],
        ];

        // Fetch revenue data for the chart
        $revenueData = $this->getRevenueData();

        // Fetch recent students
        $recentStudents = User::where('role', 'student')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'avatar' => $student->avatar ?? 'https://i.pravatar.cc/100?img=' . ($student->id % 70)
                ];
            });

        // Fetch recent bookings/sessions
        $recentBookings = TeachingSession::with('student:id,name,avatar')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function($session) {
                return [
                    'id' => $session->id,
                    'user' => [
                        'name' => $session->student->name,
                        'avatar' => $session->student->avatar ?? 'https://i.pravatar.cc/100?img=' . ($session->student->id % 70)
                    ],
                    'action' => $this->getSessionActionText($session->status),
                    'subject' => $session->subject
                ];
            });

        return Inertia::render('dashboards/admin', [
            'statsData' => $statsData,
            'revenueData' => $revenueData,
            'students' => $recentStudents,
            'totalStudents' => User::where('role', 'student')->count(),
            'bookings' => $recentBookings,
            'totalBookings' => TeachingSession::count()
        ]);
    }

    /**
     * Get the revenue data for the chart
     */
    private function getRevenueData(): array
    {
        // This would typically come from the subscription_payments table
        // For now, generating sample data based on real months
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $revenueData = [];

        // Check if we have subscription_payments table with real data
        if (DB::getSchemaBuilder()->hasTable('subscription_payments')) {
            // Group payments by month and sum the amounts
            $monthlyRevenue = DB::table('subscription_payments')
                ->select(DB::raw('MONTH(payment_date) as month, SUM(amount) as revenue'))
                ->where('status', 'completed')
                ->whereYear('payment_date', date('Y'))
                ->groupBy('month')
                ->get()
                ->keyBy('month')
                ->toArray();

            // Format the data for the chart
            foreach ($months as $index => $month) {
                $monthNum = $index + 1;
                $revenue = isset($monthlyRevenue[$monthNum]) ?
                    $monthlyRevenue[$monthNum]->revenue * 100 : // Multiply by 100 to show in currency units
                    rand(300000, 600000); // Fallback to random data if no real data

                $revenueData[] = [
                    'name' => $month,
                    'value' => $revenue
                ];
            }
        } else {
            // Fallback to sample data
            foreach ($months as $month) {
                $revenueData[] = [
                    'name' => $month,
                    'value' => rand(300000, 600000)
                ];
            }
        }

        return $revenueData;
    }

    /**
     * Get action text based on session status
     */
    private function getSessionActionText(string $status): string
    {
        return match($status) {
            'scheduled' => 'booked a',
            'confirmed' => 'confirmed a',
            'completed' => 'completed a',
            'cancelled_by_student' => 'cancelled a',
            'cancelled_by_teacher' => 'had cancelled',
            default => 'registered for'
        };
    }

    /**
     * Get teacher icon SVG
     */
    private function getTeacherIcon(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="#2c7870" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z"/></svg>';
    }

    /**
     * Get student icon SVG
     */
    private function getStudentIcon(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="#2c7870" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z"/></svg>';
    }

    /**
     * Get subscription icon SVG
     */
    private function getSubscriptionIcon(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c7870"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm80 240v-80h400v80H280Zm0 160v-80h280v80H280Z"/></svg>';
    }

    /**
     * Get verification icon SVG
     */
    private function getVerificationIcon(): string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c7870"><path d="M280-420q25 0 42.5-17.5T340-480q0-25-17.5-42.5T280-540q-25 0-42.5 17.5T220-480q0 25 17.5 42.5T280-420Zm200 0q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm200 0q25 0 42.5-17.5T740-480q0-25-17.5-42.5T680-540q-25 0-42.5 17.5T620-480q0 25 17.5 42.5T680-420ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
    }
}
