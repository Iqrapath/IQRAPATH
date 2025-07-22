<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have subjects
        if (Subject::count() === 0) {
            $this->call(SubjectSeeder::class);
        }

        // Create bookings with different statuses
        // Pending bookings
        Booking::factory()
            ->count(5)
            ->pending()
            ->create();

        // Approved bookings
        Booking::factory()
            ->count(10)
            ->approved()
            ->create();

        // Completed bookings
        Booking::factory()
            ->count(15)
            ->completed()
            ->create();

        // Cancelled bookings
        Booking::factory()
            ->count(5)
            ->cancelled()
            ->create();

        // Rejected bookings
        Booking::factory()
            ->count(3)
            ->rejected()
            ->create();

        // Upcoming bookings
        Booking::factory()
            ->count(8)
            ->upcoming()
            ->create();

        // Missed bookings
        Booking::factory()
            ->count(4)
            ->missed()
            ->create();

        // Create some rescheduled bookings
        $cancelledBookings = Booking::where('status', 'cancelled')->take(3)->get();
        foreach ($cancelledBookings as $booking) {
            Booking::factory()
                ->rescheduled($booking)
                ->upcoming()
                ->create();
        }

        // Create bookings for specific teachers and students
        $teachers = User::where('role', 'teacher')->take(3)->get();
        $students = User::where('role', 'student')->take(5)->get();
        $subjects = Subject::take(4)->get();

        foreach ($teachers as $teacher) {
            foreach ($students as $student) {
                // Create at least one booking for each teacher-student pair
                Booking::factory()->create([
                    'teacher_id' => $teacher->id,
                    'student_id' => $student->id,
                    'subject_id' => $subjects->random()->id,
                ]);
            }

            // Create a few more bookings for each teacher with random students
            Booking::factory()
                ->count(3)
                ->create([
                    'teacher_id' => $teacher->id,
                ]);
        }
    }
}
