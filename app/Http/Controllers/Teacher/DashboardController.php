<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the teacher dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $teacherProfile = $user->teacherProfile;

        // Create a simplified array for the frontend
        $teacherProfileData = null;
        if ($teacherProfile) {
            $teacherProfileData = [
                'is_verified' => (bool) $teacherProfile->is_verified,
                'education_level' => $teacherProfile->education_level,
                'bio' => $teacherProfile->bio,
                'years_of_experience' => $teacherProfile->years_of_experience,
                'teaching_subjects' => $teacherProfile->teaching_subjects,
                'specialization' => $teacherProfile->specialization,
            ];
        }

        return Inertia::render('dashboards/teacher', [
            'teacherProfile' => $teacherProfileData,
        ]);
    }
}
