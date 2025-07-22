<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentController;
use App\Http\Controllers\API\LearningPreferenceController;
use App\Http\Controllers\API\TeacherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Student management endpoints
Route::post('/students', [StudentController::class, 'store']);
Route::get('/students/{id}', [StudentController::class, 'show']);

// Learning Preferences
Route::post('/learning-preferences', [LearningPreferenceController::class, 'store'])
    ->middleware('auth:sanctum');
Route::get('/learning-preferences/check/{userId}', [LearningPreferenceController::class, 'checkPreferences'])
    ->middleware('auth:sanctum');

// V1 API Routes
Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/auth/login', [App\Http\Controllers\API\AuthController::class, 'login']);
    
    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [App\Http\Controllers\API\AuthController::class, 'logout']);
        Route::get('/auth/user', [App\Http\Controllers\API\AuthController::class, 'user']);
        
        // Student routes
        Route::prefix('student')->group(function () {
            Route::get('stats', [App\Http\Controllers\API\StudentController::class, 'getStats']);
            Route::get('upcoming-classes', [App\Http\Controllers\API\StudentController::class, 'getUpcomingClasses']);
            Route::get('recommended-teachers', [TeacherController::class, 'getRecommendedTeachers']);
        });
    });
});
