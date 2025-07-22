<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the users table.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@sch.com',
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Create demo accounts for each role
        User::factory()->create([
            'name' => 'Teacher',
            'email' => 'teacher@sch.com',
            'role' => 'teacher',
            'status' => 'active',
            'avatar' => 'https://randomuser.me/api/portraits/men/42.jpg',
        ]);

        User::factory()->create([
            'name' => 'Student',
            'email' => 'student@sch.com',
            'role' => 'student',
            'status' => 'active',
            'avatar' => 'https://randomuser.me/api/portraits/men/22.jpg',
        ]);

        User::factory()->create([
            'name' => 'Guardian',
            'email' => 'guardian@sch.com',
            'role' => 'guardian',
            'status' => 'active',
            'avatar' => 'https://randomuser.me/api/portraits/women/42.jpg',
        ]);

        // Create regular users
        // Teachers
        User::factory()
            ->count(20)
            ->state(['role' => 'teacher'])
            ->create();

        // Students
        User::factory()
            ->count(30)
            ->state(['role' => 'student'])
            ->create();

        // Guardians
        User::factory()
            ->count(15)
            ->state(['role' => 'guardian'])
            ->create();
    }
} 