<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\User;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all teacher users
        $teachers = User::where('role', 'teacher')->get();
        
        if ($teachers->isEmpty()) {
            $this->command->info('No teachers found. Skipping schedule seeding.');
            return;
        }
        
        // Days of the week
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Common time slots
        $timeSlots = [
            ['09:00', '11:00'],
            ['11:30', '13:30'],
            ['14:00', '16:00'],
            ['17:00', '19:00'],
            ['19:30', '21:30'],
        ];
        
        // Clear existing schedules
        Schedule::where('user_role', 'teacher')->delete();
        
        foreach ($teachers as $teacher) {
            // Randomly select 3-5 days for availability
            $availableDays = collect($days)->random(rand(3, 5))->toArray();
            
            foreach ($availableDays as $day) {
                // Randomly select 1-3 time slots for each day
                $daySlots = collect($timeSlots)->random(rand(1, 3))->toArray();
                
                foreach ($daySlots as $slot) {
                    // Format time strings as proper datetime objects
                    $startTime = Carbon::createFromFormat('H:i', $slot[0])->format('H:i:s');
                    $endTime = Carbon::createFromFormat('H:i', $slot[1])->format('H:i:s');
                    
                    Schedule::create([
                        'user_id' => $teacher->id,
                        'user_role' => 'teacher',
                        'day_of_week' => $day,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'is_available' => true,
                        'is_recurring' => true,
                        'timezone' => 'UTC',
                        'updated_by' => $teacher->id,
                    ]);
                }
            }
        }
        
        $this->command->info('Teacher schedules seeded successfully!');
    }
} 