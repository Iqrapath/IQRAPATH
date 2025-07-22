<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Schedule;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d');
        $startHour = $this->faker->numberBetween(8, 20);
        $startTime = sprintf('%02d:00:00', $startHour);
        $duration = $this->faker->randomElement([30, 45, 60, 90, 120]);
        $endTime = sprintf('%02d:%02d:00', 
            $startHour + floor($duration / 60), 
            $duration % 60
        );

        $statuses = ['pending', 'approved', 'rejected', 'upcoming', 'completed', 'missed', 'cancelled'];
        $status = $this->faker->randomElement($statuses);

        return [
            'booking_reference' => 'BK-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4)),
            'student_id' => User::where('role', 'student')->inRandomOrder()->first() ?? User::factory()->create(['role' => 'student']),
            'teacher_id' => User::where('role', 'teacher')->inRandomOrder()->first() ?? User::factory()->create(['role' => 'teacher']),
            'subject_id' => Subject::inRandomOrder()->first() ?? Subject::factory()->create(),
            'schedule_id' => null, // Can be set later if needed
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
            'status' => $status,
            'notes' => $this->faker->optional(0.7)->sentence(),
            'previous_booking_id' => null, // Can be set later if needed
            'cancellation_reason' => $status === 'cancelled' ? $this->faker->sentence() : null,
            'cancelled_at' => $status === 'cancelled' ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'rescheduled_at' => $this->faker->optional(0.2)->dateTimeBetween('-1 week', 'now'),
            'approved_at' => in_array($status, ['approved', 'upcoming', 'completed']) ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'rejected_at' => $status === 'rejected' ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'completed_at' => $status === 'completed' ? $this->faker->dateTimeBetween('-1 day', 'now') : null,
        ];
    }

    /**
     * Indicate that the booking is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
            'rejected_at' => null,
            'completed_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the booking is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => now(),
            'rejected_at' => null,
            'completed_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the booking is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'approved_at' => now()->subDays(rand(1, 7)),
            'completed_at' => now(),
            'rejected_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the booking is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $this->faker->sentence(),
            'approved_at' => null,
            'rejected_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the booking is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejected_at' => now(),
            'cancellation_reason' => $this->faker->sentence(),
            'approved_at' => null,
            'cancelled_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the booking is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(function (array $attributes) {
            $date = now()->addDays(rand(1, 14))->format('Y-m-d');
            $startHour = rand(8, 20);
            $startTime = sprintf('%02d:00:00', $startHour);
            $duration = $this->faker->randomElement([30, 45, 60, 90, 120]);
            $endTime = sprintf('%02d:%02d:00', 
                $startHour + floor($duration / 60), 
                $duration % 60
            );
            
            return [
                'status' => 'upcoming',
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $duration,
                'approved_at' => now()->subDays(rand(1, 3)),
                'rejected_at' => null,
                'cancelled_at' => null,
                'completed_at' => null,
            ];
        });
    }

    /**
     * Indicate that the booking is missed.
     */
    public function missed(): static
    {
        return $this->state(function (array $attributes) {
            $date = now()->subDays(rand(1, 7))->format('Y-m-d');
            $startHour = rand(8, 20);
            $startTime = sprintf('%02d:00:00', $startHour);
            $duration = $this->faker->randomElement([30, 45, 60, 90, 120]);
            $endTime = sprintf('%02d:%02d:00', 
                $startHour + floor($duration / 60), 
                $duration % 60
            );
            
            return [
                'status' => 'missed',
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $duration,
                'approved_at' => now()->subDays(rand(8, 14)),
                'rejected_at' => null,
                'cancelled_at' => null,
                'completed_at' => null,
            ];
        });
    }

    /**
     * Set a specific schedule for this booking.
     */
    public function withSchedule(Schedule $schedule = null): static
    {
        if (!$schedule) {
            $schedule = Schedule::inRandomOrder()->first() ?? Schedule::factory()->create();
        }

        return $this->state(function (array $attributes) use ($schedule) {
            // Extract day of week from date
            $date = $attributes['date'] ?? now()->addDays(rand(1, 7))->format('Y-m-d');
            $dayOfWeek = date('l', strtotime($date));
            
            // Get schedule details
            $scheduleData = json_decode($schedule->schedule_data, true);
            $daySchedule = $scheduleData[$dayOfWeek] ?? null;
            
            if (!$daySchedule || empty($daySchedule['slots'])) {
                return [
                    'schedule_id' => $schedule->id,
                ];
            }
            
            // Pick a random slot from the schedule
            $slot = $this->faker->randomElement($daySchedule['slots']);
            
            return [
                'schedule_id' => $schedule->id,
                'date' => $date,
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'duration' => (strtotime($slot['end_time']) - strtotime($slot['start_time'])) / 60,
            ];
        });
    }

    /**
     * Set this booking as a rescheduled booking.
     */
    public function rescheduled(Booking $previousBooking = null): static
    {
        if (!$previousBooking) {
            $previousBooking = Booking::factory()->cancelled()->create();
        }

        return $this->state(function (array $attributes) use ($previousBooking) {
            return [
                'previous_booking_id' => $previousBooking->id,
                'rescheduled_at' => now(),
                'student_id' => $previousBooking->student_id,
                'teacher_id' => $previousBooking->teacher_id,
                'subject_id' => $previousBooking->subject_id,
            ];
        });
    }
} 