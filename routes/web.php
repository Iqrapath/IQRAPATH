<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\TeacherManagementController;
use App\Http\Controllers\Admin\VerificationRequestController;
use App\Http\Controllers\Teacher\EarningsController;
use App\Http\Controllers\Teacher\DocumentController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Student registration routes (no auth required)
Route::post('/students', [StudentController::class, 'store'])->name('students.store');
Route::get('/students/{id}', [StudentController::class, 'show'])->name('students.show');

// Teacher registration route (no auth required)
Route::post('/teachers', [TeacherManagementController::class, 'store'])->name('teachers.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin routes
    Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Teacher Management
        Route::get('/teachers', [TeacherManagementController::class, 'index'])->name('teachers.index');
        Route::get('/teachers/{id}', [TeacherManagementController::class, 'show'])->name('teachers.show');
        Route::get('/teachers/{id}/earnings', [TeacherManagementController::class, 'showEarnings'])->name('teachers.earnings');
        Route::post('/teachers/{id}/payout', [TeacherManagementController::class, 'processPayout'])->name('teachers.payout');
        Route::post('/teachers/{id}/payout-requests/{requestId}/approve', [TeacherManagementController::class, 'approvePayoutRequest'])->name('teachers.payout-requests.approve');
        Route::post('/teachers/{id}/payout-requests/{requestId}/reject', [TeacherManagementController::class, 'rejectPayoutRequest'])->name('teachers.payout-requests.reject');
        Route::post('/teachers/{id}/approve', [TeacherManagementController::class, 'approve'])->name('teachers.approve');
        Route::post('/teachers/{id}/reject', [TeacherManagementController::class, 'reject'])->name('teachers.reject');
        Route::put('/teachers/{id}', [TeacherManagementController::class, 'updateProfile'])->name('teachers.update');
        Route::delete('/teachers/{id}', [TeacherManagementController::class, 'destroy'])->name('teachers.destroy');
        
        // Teacher Document Management
        Route::get('/teachers/{id}/documents', [TeacherManagementController::class, 'getDocuments'])->name('teachers.documents');
        Route::post('/teachers/{id}/documents', [TeacherManagementController::class, 'uploadDocument'])->name('teachers.documents.upload');
        Route::post('/teachers/{id}/documents/{documentId}/verify', [TeacherManagementController::class, 'verifyDocument'])->name('teachers.documents.verify');
        Route::delete('/teachers/{id}/documents/{documentId}', [TeacherManagementController::class, 'deleteDocument'])->name('teachers.documents.delete');
        
        // Verification Requests
        Route::get('/verification', [VerificationRequestController::class, 'index'])->name('verification');
        Route::get('/verification-requests', [VerificationRequestController::class, 'index'])->name('verification-requests');
        Route::post('/verification-requests/{id}/verify', [VerificationRequestController::class, 'verify'])->name('verification-requests.verify');
        Route::post('/verification-requests/{id}/reject', [VerificationRequestController::class, 'reject'])->name('verification-requests.reject');
        Route::post('/verification-requests/{id}/schedule', [VerificationRequestController::class, 'scheduleCall'])->name('verification-requests.schedule');
        Route::post('/verification-requests/{id}/complete-call', [VerificationRequestController::class, 'completeVideoCall'])->name('verification-requests.complete-call');
        Route::post('/verification-requests/{id}/missed-call', [VerificationRequestController::class, 'missedVideoCall'])->name('verification-requests.missed-call');
        Route::post('/verification-requests/{id}/live-video', [VerificationRequestController::class, 'setLiveVideo'])->name('verification-requests.live-video');
        
        // Verification details and scheduling
        Route::get('/verification-requests/{id}', [VerificationRequestController::class, 'show'])->name('verification-requests.show');
        Route::get('/verification-requests/{id}/schedule-form', [VerificationRequestController::class, 'scheduleForm'])->name('verification-requests.schedule-form');
            
        // Payout Management
        Route::get('/payouts', [App\Http\Controllers\Admin\PayoutManagementController::class, 'index'])->name('payouts.index');
        Route::get('/payouts/{id}', [App\Http\Controllers\Admin\PayoutManagementController::class, 'show'])->name('payouts.show');
        Route::post('/payouts/{id}/process', [App\Http\Controllers\Admin\PayoutManagementController::class, 'process'])->name('payouts.process');

        // Subscription Plan Management
        Route::get('/subscription-plans', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'index'])->name('subscription-plans.index');
        Route::get('/subscription-plans/create', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'edit'])->name('subscription-plans.create');
        Route::get('/subscription-plans/{plan}/edit', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'edit'])->name('subscription-plans.edit');
        Route::post('/subscription-plans', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'store'])->name('subscription-plans.store');
        Route::post('/subscription-plans/{plan}', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'store'])->name('subscription-plans.update');
        Route::post('/subscription-plans/{plan}/toggle-status', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'toggleStatus'])->name('subscription-plans.toggle-status');
        Route::post('/subscription-plans/{plan}/duplicate', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'duplicate'])->name('subscription-plans.duplicate');
        Route::delete('/subscription-plans/{plan}', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'destroy'])->name('subscription-plans.destroy');
        Route::get('/subscription-plans/{plan}/users', [App\Http\Controllers\Admin\SubscriptionPlanController::class, 'viewEnrolledUsers'])->name('subscription-plans.users');
    });

    // Teacher routes
    Route::middleware(['teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');
        
        // Teacher Documents Routes
        Route::get('documents', [DocumentController::class, 'index'])->name('documents.index');
        Route::post('documents', [DocumentController::class, 'upload'])->name('documents.upload');
        Route::delete('documents/{id}', [DocumentController::class, 'delete'])->name('documents.delete');
        
        // Teacher Earnings Routes
        Route::get('earnings', [EarningsController::class, 'index'])->name('earnings.index');
        Route::get('earnings/transactions', [EarningsController::class, 'transactions'])->name('earnings.transactions');
        Route::get('earnings/history', [EarningsController::class, 'earnings'])->name('earnings.history');
        Route::get('earnings/payouts', [EarningsController::class, 'payouts'])->name('earnings.payouts');
        Route::post('earnings/request-payout', [EarningsController::class, 'requestPayout'])->name('earnings.request-payout');
    });

    // Student routes
    Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
        Route::get('dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
        Route::get('stats', [StudentController::class, 'getStats'])->name('student.stats');
        Route::get('upcoming-classes', [StudentController::class, 'getUpcomingClasses'])->name('upcoming-classes');
        Route::get('recommended-teachers', function (Request $request) {
            return app()->make(\App\Http\Controllers\API\TeacherController::class)->getRecommendedTeachers($request);
        });
    });

    // Guardian routes
    Route::middleware(['guardian'])->prefix('guardian')->name('guardian.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Guardian\DashboardController::class, 'index'])->name('dashboard');
    });

    // Learning Preferences
    Route::post('/learning-preferences', [App\Http\Controllers\LearningPreferenceController::class, 'store'])->name('learning-preferences.store');
    Route::get('/check-learning-preferences', [App\Http\Controllers\LearningPreferenceController::class, 'checkPreferences'])->name('learning-preferences.check');

    // Child Registration for Guardians
    Route::post('/register-children', [App\Http\Controllers\Guardian\ChildRegistrationController::class, 'register'])
        ->middleware(['auth'])
        ->name('register.children');

    // Booking routes
    Route::resource('bookings', App\Http\Controllers\BookingController::class);
    Route::post('/bookings/{booking}/approve', [App\Http\Controllers\BookingController::class, 'approve'])->name('bookings.approve');
    Route::post('/bookings/{booking}/reject', [App\Http\Controllers\BookingController::class, 'reject'])->name('bookings.reject');
    Route::post('/bookings/{booking}/cancel', [App\Http\Controllers\BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::post('/bookings/{booking}/complete', [App\Http\Controllers\BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('/bookings/{booking}/miss', [App\Http\Controllers\BookingController::class, 'miss'])->name('bookings.miss');
    Route::post('/bookings/{booking}/reschedule', [App\Http\Controllers\BookingController::class, 'reschedule'])->name('bookings.reschedule');

    // Test routes (remove in production)
    Route::middleware(['auth'])->get('/test-api', function () {
        return Inertia::render('test-api-client');
    })->name('test-api');
});

// Document files access route
Route::get('/document/{type}/{id}/{filename}', function ($type, $id, $filename) {
    $path = "teacher_documents/{$id}/{$type}/{$filename}";
    $fullPath = storage_path("app/public/{$path}");
    
    if (!file_exists($fullPath)) {
        abort(404, 'File not found');
    }
    
    // Get file mime type
    $mime = mime_content_type($fullPath);
    
    // Return file with proper mime type
    return response()->file($fullPath, ['Content-Type' => $mime]);
})->name('document.view');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
