<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core user and profile seeders
            UserSeeder::class,
            TeacherProfileSeeder::class,
            TeachingSessionSeeder::class,
            ScheduleSeeder::class,
            SubscriptionSeeder::class,
            // Ratings seeder
            RatingSeeder::class,
            // Financial seeders (via orchestrator)
            TeacherFinanceSeeder::class,
        ]);
    }
}
