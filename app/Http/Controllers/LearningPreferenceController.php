<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LearningPreference;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningPreferenceController extends Controller
{
    /**
     * Store a newly created learning preference.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'preferred_subjects' => 'required|array',
            'teaching_mode' => 'required|in:full-time,part-time',
            'preferred_learning_times' => 'required|array',
        ]);

        // Check if user already has preferences
        $existingPreference = LearningPreference::where('user_id', Auth::id())->first();

        if ($existingPreference) {
            // Update existing preferences
            $existingPreference->update([
                'preferred_subjects' => $request->preferred_subjects,
                'teaching_mode' => $request->teaching_mode,
                'preferred_learning_times' => $request->preferred_learning_times,
                'additional_notes' => $request->additional_notes ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Learning preferences updated successfully'
            ]);
        }

        // Create new preferences
        LearningPreference::create([
            'user_id' => Auth::id(),
            'preferred_subjects' => $request->preferred_subjects,
            'teaching_mode' => $request->teaching_mode,
            'preferred_learning_times' => $request->preferred_learning_times,
            'additional_notes' => $request->additional_notes ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Learning preferences saved successfully'
        ]);
    }

    /**
     * Check if the authenticated user has learning preferences.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPreferences()
    {
        $hasPreferences = LearningPreference::where('user_id', Auth::id())->exists();

        return response()->json([
            'hasPreferences' => $hasPreferences
        ]);
    }
}
