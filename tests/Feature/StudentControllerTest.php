<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\LearningPreference;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;

class StudentControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test student registration endpoint.
     */
    public function test_can_register_new_student(): void
    {
        // Prepare test data
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'phone_number' => $this->faker->phoneNumber,
            'location' => $this->faker->city,
            'role' => 'student',
            'status' => 'active',
            'registration_date' => Carbon::now()->format('Y-m-d'),
        ];

        $preferencesData = [
            'preferredSubjects' => ['Quran', 'Arabic', 'Islamic Studies'],
            'teachingMode' => 'full-time',
            'studentAgeGroup' => '7-9 Years',
            'preferredLearningTimes' => [
                [
                    'day' => 'Monday',
                    'fromTime' => '09:00',
                    'toTime' => '11:00',
                    'isSelected' => true
                ],
                [
                    'day' => 'Wednesday',
                    'fromTime' => '09:00',
                    'toTime' => '11:00',
                    'isSelected' => true
                ],
            ],
            'additionalNotes' => 'Student is motivated to learn Quran',
        ];

        $subscriptionData = [
            'activePlan' => "Juz' Amma - ₦10,000/month",
            'startDate' => Carbon::now()->format('Y-m-d'),
            'endDate' => Carbon::now()->addMonths(3)->format('Y-m-d'),
            'status' => 'Active',
            'additionalNotes' => 'Quarterly subscription',
        ];

        // Make the API call
        $response = $this->postJson('/students', [
            'user' => $userData,
            'preferences' => $preferencesData,
            'subscription' => $subscriptionData,
        ]);

        // Check response
        $response->assertStatus(201)
                 ->assertJsonPath('message', 'Student created successfully')
                 ->assertJsonStructure([
                     'message',
                     'student' => [
                         'id',
                         'name',
                     ]
                 ]);

        // Verify database records
        $this->assertDatabaseHas('users', [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'role' => 'student',
        ]);

        // Get the created user
        $user = User::where('email', $userData['email'])->first();

        // Verify student profile was created
        $this->assertDatabaseHas('student_profiles', [
            'user_id' => $user->id,
            'phone_number' => $userData['phone_number'],
            'location' => $userData['location'],
        ]);

        // Verify learning preferences were created
        $this->assertDatabaseHas('learning_preferences', [
            'user_id' => $user->id,
            'teaching_mode' => $preferencesData['teachingMode'],
            'student_age_group' => $preferencesData['studentAgeGroup'],
        ]);

        // Verify subscription was created
        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $user->id,
            'status' => strtolower($subscriptionData['status']),
        ]);
    }

    /**
     * Test validation errors during student registration.
     */
    public function test_validation_errors_during_registration(): void
    {
        // Make the API call with incomplete data
        $response = $this->postJson('/students', [
            'user' => [
                'name' => '',  // Missing required field
                'email' => 'invalid-email',  // Invalid email
            ],
            // Missing preferences and subscription data
        ]);

        // Check response
        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'user.name',
                     'user.email',
                     'user.phone_number',
                     'user.location',
                     'subscription.activePlan',
                     'subscription.startDate',
                     'subscription.endDate',
                 ]);
    }
}
