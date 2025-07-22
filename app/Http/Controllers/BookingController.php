<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the bookings.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->query('status');
        $query = null;

        // Determine which bookings to show based on user role
        if ($user->role === 'teacher') {
            $query = $user->teacherBookings();
        } elseif ($user->role === 'student') {
            $query = $user->studentBookings();
        } elseif ($user->role === 'guardian') {
            // Get bookings for all children of this guardian
            $studentIds = $user->guardianStudents()->pluck('user_id');
            $query = Booking::whereIn('student_id', $studentIds);
        } elseif ($user->role === 'admin') {
            // Admins can see all bookings
            $query = Booking::query();
        }

        // Filter by status if provided
        if ($status && $query) {
            $query->where('status', $status);
        }

        // Get the bookings with related data
        $bookings = $query ? $query->with(['teacher', 'student', 'subject'])
                             ->orderBy('date', 'desc')
                             ->orderBy('start_time', 'desc')
                             ->paginate(10)
                             ->withQueryString() : collect();

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new booking.
     */
    public function create()
    {
        $user = Auth::user();
        $teachers = [];
        $students = [];
        $subjects = Subject::active()->get();

        if ($user->role === 'admin') {
            $teachers = User::where('role', 'teacher')
                ->whereHas('teacherProfile', function($query) {
                    $query->where('is_verified', true);
                })
                ->get();
            $students = User::where('role', 'student')->get();
        } elseif ($user->role === 'guardian') {
            $teachers = User::where('role', 'teacher')
                ->whereHas('teacherProfile', function($query) {
                    $query->where('is_verified', true);
                })
                ->get();
            $students = $user->guardianStudents()->with('user')->get()->pluck('user');
        } elseif ($user->role === 'student') {
            $teachers = User::where('role', 'teacher')
                ->whereHas('teacherProfile', function($query) {
                    $query->where('is_verified', true);
                })
                ->get();
            $students = collect([$user]);
        }

        return Inertia::render('bookings/create', [
            'teachers' => $teachers,
            'students' => $students,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'student_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:500',
        ]);

        // Calculate duration in minutes
        $startTime = strtotime($validated['start_time']);
        $endTime = strtotime($validated['end_time']);
        $durationMinutes = ($endTime - $startTime) / 60;

        // Check for booking conflicts
        $hasConflict = Booking::hasTeacherConflict(
            $validated['teacher_id'],
            $validated['date'],
            $validated['start_time'],
            $validated['end_time']
        );

        if ($hasConflict) {
            return back()->withErrors([
                'time_conflict' => 'The selected time conflicts with an existing booking for this teacher.'
            ]);
        }

        // Create the booking
        $booking = new Booking([
            'teacher_id' => $validated['teacher_id'],
            'student_id' => $validated['student_id'],
            'subject_id' => $validated['subject_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration' => $durationMinutes,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        $booking->save();

        return redirect()->route('bookings.index')
            ->with('success', 'Booking request created successfully. Awaiting teacher approval.');
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Load relationships
        $booking->load(['teacher.teacherProfile', 'student.studentProfile', 'subject']);

        return Inertia::render('bookings/show', [
            'booking' => $booking,
        ]);
    }

    /**
     * Show the form for editing the specified booking.
     */
    public function edit(Booking $booking)
    {
        // Only allow editing of pending or upcoming bookings
        if (!in_array($booking->status, ['pending', 'upcoming'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'This booking cannot be edited.');
        }

        $subjects = Subject::active()->get();

        return Inertia::render('bookings/edit', [
            'booking' => $booking->load(['teacher', 'student', 'subject']),
            'subjects' => $subjects,
        ]);
    }

    /**
     * Update the specified booking in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        // Only allow updates to pending or upcoming bookings
        if (!in_array($booking->status, ['pending', 'upcoming'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'This booking cannot be updated.');
        }

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:500',
        ]);

        // Calculate duration in minutes
        $startTime = strtotime($validated['start_time']);
        $endTime = strtotime($validated['end_time']);
        $durationMinutes = ($endTime - $startTime) / 60;

        // Check for booking conflicts (excluding this booking)
        $hasConflict = Booking::hasTeacherConflict(
            $booking->teacher_id,
            $validated['date'],
            $validated['start_time'],
            $validated['end_time'],
            $booking->id
        );

        if ($hasConflict) {
            return back()->withErrors([
                'time_conflict' => 'The selected time conflicts with an existing booking for this teacher.'
            ]);
        }

        // Update the booking
        $booking->update([
            'subject_id' => $validated['subject_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration' => $durationMinutes,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified booking from storage.
     */
    public function destroy(Booking $booking)
    {
        // Only allow deletion of pending bookings
        if ($booking->status !== 'pending') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Only pending bookings can be deleted.');
        }

        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }

    /**
     * Approve a booking (teacher only).
     */
    public function approve(Booking $booking)
    {
        $user = Auth::user();

        // Only teachers can approve their own bookings
        if ($user->role !== 'teacher' || $booking->teacher_id !== $user->id) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to approve this booking.');
        }

        // Only pending bookings can be approved
        if ($booking->status !== 'pending') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Only pending bookings can be approved.');
        }

        $booking->approve();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking approved successfully.');
    }

    /**
     * Reject a booking (teacher only).
     */
    public function reject(Request $request, Booking $booking)
    {
        $user = Auth::user();

        // Only teachers can reject their own bookings
        if ($user->role !== 'teacher' || $booking->teacher_id !== $user->id) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to reject this booking.');
        }

        // Only pending bookings can be rejected
        if ($booking->status !== 'pending') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Only pending bookings can be rejected.');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $booking->reject($validated['reason'] ?? null);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking rejected successfully.');
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Request $request, Booking $booking)
    {
        $user = Auth::user();

        // Check if user is authorized to cancel
        $canCancel = false;
        
        if ($user->role === 'admin') {
            $canCancel = true;
        } elseif ($user->role === 'teacher' && $booking->teacher_id === $user->id) {
            $canCancel = true;
        } elseif ($user->role === 'student' && $booking->student_id === $user->id) {
            $canCancel = true;
        } elseif ($user->role === 'guardian') {
            $studentIds = $user->guardianStudents()->pluck('user_id');
            $canCancel = $studentIds->contains($booking->student_id);
        }

        if (!$canCancel) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to cancel this booking.');
        }

        // Only pending, approved, or upcoming bookings can be cancelled
        if (!in_array($booking->status, ['pending', 'approved', 'upcoming'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'This booking cannot be cancelled.');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $booking->cancel($validated['reason'] ?? null);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking cancelled successfully.');
    }

    /**
     * Mark a booking as completed (teacher only).
     */
    public function complete(Booking $booking)
    {
        $user = Auth::user();

        // Only teachers can mark their own bookings as completed
        if ($user->role !== 'teacher' || $booking->teacher_id !== $user->id) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to complete this booking.');
        }

        // Only upcoming bookings can be marked as completed
        if ($booking->status !== 'upcoming') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Only upcoming bookings can be marked as completed.');
        }

        $booking->complete();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking marked as completed successfully.');
    }

    /**
     * Mark a booking as missed (teacher only).
     */
    public function miss(Booking $booking)
    {
        $user = Auth::user();

        // Only teachers can mark their own bookings as missed
        if ($user->role !== 'teacher' || $booking->teacher_id !== $user->id) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to mark this booking as missed.');
        }

        // Only upcoming bookings can be marked as missed
        if ($booking->status !== 'upcoming') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Only upcoming bookings can be marked as missed.');
        }

        $booking->miss();

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking marked as missed successfully.');
    }

    /**
     * Reschedule a booking.
     */
    public function reschedule(Request $request, Booking $booking)
    {
        $user = Auth::user();

        // Check if user is authorized to reschedule
        $canReschedule = false;
        
        if ($user->role === 'admin') {
            $canReschedule = true;
        } elseif ($user->role === 'teacher' && $booking->teacher_id === $user->id) {
            $canReschedule = true;
        } elseif ($user->role === 'student' && $booking->student_id === $user->id) {
            $canReschedule = true;
        } elseif ($user->role === 'guardian') {
            $studentIds = $user->guardianStudents()->pluck('user_id');
            $canReschedule = $studentIds->contains($booking->student_id);
        }

        if (!$canReschedule) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'You are not authorized to reschedule this booking.');
        }

        // Only approved, upcoming, or cancelled bookings can be rescheduled
        if (!in_array($booking->status, ['approved', 'upcoming', 'cancelled'])) {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'This booking cannot be rescheduled.');
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:500',
        ]);

        // Calculate duration in minutes
        $startTime = strtotime($validated['start_time']);
        $endTime = strtotime($validated['end_time']);
        $durationMinutes = ($endTime - $startTime) / 60;

        // Check for booking conflicts
        $hasConflict = Booking::hasTeacherConflict(
            $booking->teacher_id,
            $validated['date'],
            $validated['start_time'],
            $validated['end_time']
        );

        if ($hasConflict) {
            return back()->withErrors([
                'time_conflict' => 'The selected time conflicts with an existing booking for this teacher.'
            ]);
        }

        // If not already cancelled, cancel the original booking
        if ($booking->status !== 'cancelled') {
            $booking->cancel('Rescheduled to a new time.');
        }

        // Create a new booking as a reschedule
        $newBooking = new Booking([
            'teacher_id' => $booking->teacher_id,
            'student_id' => $booking->student_id,
            'subject_id' => $booking->subject_id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration' => $durationMinutes,
            'status' => 'pending', // New booking starts as pending
            'notes' => $validated['notes'] ?? $booking->notes,
            'previous_booking_id' => $booking->id,
            'rescheduled_at' => now(),
        ]);

        $newBooking->save();

        return redirect()->route('bookings.show', $newBooking)
            ->with('success', 'Booking rescheduled successfully. Awaiting approval for the new time.');
    }
}
