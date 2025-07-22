<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TeacherProfile;

class TeacherController extends Controller
{
    /**
     * Get recommended teachers for the student dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getRecommendedTeachers(Request $request)
    {
        try {
            // Get the authenticated user
            $user = $request->user();
            
            // Get recommended teachers based on user's learning preferences
            // or just get top-rated teachers if no specific preferences
            $teachers = User::where('role', 'teacher')
                ->where('status', 'active')
                ->with(['teacherProfile', 'ratingsReceived'])
                ->take(5)
                ->get();
                
            $formattedTeachers = $teachers->map(function($teacher) {
                // Calculate average rating
                $ratings = $teacher->ratingsReceived;
                $avgRating = $ratings->avg('rating') ?? 4.5; // Default to 4.5 if no ratings
                
                // Get teacher profile
                $profile = $teacher->teacherProfile;
                
                // Format the subjects - ensure it's always an array
                $subjects = [];
                if ($profile && $profile->teaching_subjects) {
                    $subjects = is_array($profile->teaching_subjects) 
                        ? $profile->teaching_subjects 
                        : (json_decode($profile->teaching_subjects, true) ?: []);
                }
                
                // Format availability (this would ideally come from the teacher's schedule)
                $availability = "Mon-Fri, 9AM-5PM"; // Default placeholder
                
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'image' => $teacher->avatar ?? '/assets/images/teachers/default.png',
                    'subjects' => $subjects,
                    'rating' => round($avgRating, 2),
                    'reviews' => $ratings->count(),
                    'availability' => $availability,
                    'hourlyRate' => $profile && $profile->hourly_rate ? (float)$profile->hourly_rate : 25,
                    'currency' => $profile ? $profile->currency : 'USD',
                    'amountPerSession' => $profile && $profile->amount_per_session ? (float)$profile->amount_per_session : 25,
                    'location' => $teacher->location ?? 'Online'
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => [
                    'teachers' => $formattedTeachers
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'message' => 'Failed to retrieve recommended teachers',
                    'details' => $e->getMessage()
                ]
            ], 500);
        }
    }
} 