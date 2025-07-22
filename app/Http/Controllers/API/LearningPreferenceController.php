<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LearningPreference;
use Illuminate\Support\Facades\Validator;

class LearningPreferenceController extends Controller
{
    /**
     * Store a newly created learning preference.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'preferred_subjects' => 'required|array',
            'teaching_mode' => 'required|in:full-time,part-time',
            'preferred_learning_times' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user already has preferences
        $existingPreference = LearningPreference::where('user_id', $request->user_id)->first();

        if ($existingPreference) {
            // Update existing preferences
            $existingPreference->update([
                'preferred_subjects' => $request->preferred_subjects,
                'teaching_mode' => $request->teaching_mode,
                'preferred_learning_times' => $request->preferred_learning_times,
                'additional_notes' => $request->additional_notes ?? null,
            ]);

            return response()->json([
                'message' => 'Learning preferences updated successfully',
                'data' => $existingPreference
            ]);
        }

        // Create new preferences
        $preference = LearningPreference::create([
            'user_id' => $request->user_id,
            'preferred_subjects' => $request->preferred_subjects,
            'teaching_mode' => $request->teaching_mode,
            'preferred_learning_times' => $request->preferred_learning_times,
            'additional_notes' => $request->additional_notes ?? null,
        ]);

        return response()->json([
            'message' => 'Learning preferences saved successfully',
            'data' => $preference
        ], 201);
    }

    /**
     * Check if user has learning preferences.
     *
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPreferences($userId)
    {
        $preference = LearningPreference::where('user_id', $userId)->first();

        return response()->json([
            'hasPreferences' => $preference !== null,
            'data' => $preference
        ]);
    }
}
