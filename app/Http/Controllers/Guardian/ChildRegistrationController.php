<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\GuardianProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ChildRegistrationController extends Controller
{
    /**
     * Register children for a guardian
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'children' => 'required|array|min:1',
            'children.*.fullName' => 'required|string|max:255',
            'children.*.email' => 'required|email|unique:users,email',
            'children.*.password' => 'required|string|min:8',
            'children.*.confirmPassword' => 'required|same:children.*.password',
            'children.*.age' => 'required|string|max:50',
            'children.*.gender' => 'required|string|max:50',
            'children.*.dateOfBirth' => 'nullable|date',
            'children.*.educationLevel' => 'nullable|string|max:255',
            'children.*.schoolName' => 'nullable|string|max:255',
            'children.*.gradeLevel' => 'nullable|string|max:255',
        ]);

        $guardian = Auth::user();
        $guardianProfile = $guardian->guardianProfile;

        if (!$guardianProfile) {
            // Create guardian profile if it doesn't exist
            $guardianProfile = GuardianProfile::create([
                'user_id' => $guardian->id,
            ]);
        }

        $registeredChildren = [];

        foreach ($request->children as $childData) {
            // Create a new user account for the child
            $childUser = User::create([
                'name' => $childData['fullName'],
                'email' => $childData['email'],
                'password' => Hash::make($childData['password']),
                'role' => 'student',
                'status' => 'active',
                'registration_date' => now(),
                'phone_number' => null, // Will be filled later if needed
                'location' => $guardian->location, // Inherit from guardian
            ]);

            // Convert date of birth string to Carbon date if provided
            $dateOfBirth = null;
            if (!empty($childData['dateOfBirth'])) {
                $dateOfBirth = Carbon::parse($childData['dateOfBirth']);
            }

            // Create student profile
            $studentProfile = StudentProfile::create([
                'user_id' => $childUser->id,
                'guardian_id' => $guardian->id,
                'date_of_birth' => $dateOfBirth,
                'gender' => $childData['gender'],
                'is_child_account' => true,
                'education_level' => $childData['educationLevel'] ?? null,
                'school_name' => $childData['schoolName'] ?? null,
                'grade_level' => $childData['gradeLevel'] ?? null,
            ]);

            $registeredChildren[] = [
                'id' => $childUser->id,
                'name' => $childUser->name,
                'email' => $childUser->email,
                'password' => $childData['password'], // Include the original password
            ];
        }

        // Update the total_students_managed count for the guardian
        $guardianProfile->updateStudentCount();

        return response()->json([
            'message' => 'Children registered successfully',
            'count' => count($registeredChildren),
            'children' => $registeredChildren,
        ]);
    }
}
