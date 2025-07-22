<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GuardianProfile>
 */
class GuardianProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $occupations = [
            'Teacher', 'Doctor', 'Engineer', 'Lawyer', 'Business Owner',
            'Accountant', 'Software Developer', 'Professor', 'Nurse',
            'Imam', 'Religious Scholar', 'Homemaker', 'Consultant', 'Manager'
        ];

        $relationships = ['Father', 'Mother', 'Grandparent', 'Uncle', 'Aunt', 'Legal Guardian'];

        $countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Nigeria',
                      'Pakistan', 'India', 'Egypt', 'Saudi Arabia', 'UAE', 'Malaysia', 'Turkey'];

        $contactMethods = ['Email', 'Phone', 'SMS', 'WhatsApp', 'Telegram'];
        
        // Create a guardian user if needed
        $guardian = User::factory()->guardian()->create();

        return [
            'user_id' => $guardian->id,
            'relationship_to_student' => $this->faker->randomElement($relationships),
            'occupation' => $this->faker->randomElement($occupations),
            'secondary_phone' => $this->faker->boolean(70) ? $this->faker->phoneNumber() : null,
            'secondary_email' => $this->faker->boolean(50) ? $this->faker->safeEmail() : null,
            'address_line_1' => $this->faker->streetAddress(),
            'address_line_2' => $this->faker->boolean(30) ? $this->faker->secondaryAddress() : null,
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),
            'country' => $this->faker->randomElement($countries),
            'receive_progress_reports' => $this->faker->boolean(90),
            'receive_session_notifications' => $this->faker->boolean(95),
            'preferred_contact_method' => $this->faker->randomElement($contactMethods),
            'billing_name' => $this->faker->boolean(80) ? $this->faker->name() : null,
            'billing_address' => $this->faker->boolean(70) ? $this->faker->address() : null,
            'tax_id' => $this->faker->boolean(30) ? $this->faker->numerify('##-#######') : null,
            'alternate_contact_name' => $this->faker->boolean(60) ? $this->faker->name() : null,
            'alternate_contact_relationship' => $this->faker->boolean(60) ? $this->faker->randomElement(['Spouse', 'Relative', 'Friend', 'Neighbor']) : null,
            'alternate_contact_phone' => $this->faker->boolean(60) ? $this->faker->phoneNumber() : null,
            'last_login_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'total_students_managed' => $this->faker->numberBetween(1, 3), // Default to having 1-3 students
        ];
    }

    /**
     * Configure the guardian as active and engaged.
     */
    public function activeGuardian(): static
    {
        return $this->state(fn (array $attributes) => [
            'receive_progress_reports' => true,
            'receive_session_notifications' => true,
            'last_login_at' => $this->faker->dateTimeBetween('-2 weeks', 'now'),
        ]);
    }

    /**
     * Configure the guardian with multiple contact methods.
     */
    public function multipleContacts(): static
    {
        return $this->state(fn (array $attributes) => [
            'secondary_phone' => $this->faker->phoneNumber(),
            'secondary_email' => $this->faker->safeEmail(),
            'alternate_contact_name' => $this->faker->name(),
            'alternate_contact_relationship' => $this->faker->randomElement(['Spouse', 'Relative', 'Friend']),
            'alternate_contact_phone' => $this->faker->phoneNumber(),
        ]);
    }

    /**
     * Configure the guardian with complete billing information.
     */
    public function completeBilling(): static
    {
        return $this->state(fn (array $attributes) => [
            'billing_name' => $this->faker->name(),
            'billing_address' => $this->faker->address(),
            'tax_id' => $this->faker->numerify('##-#######'),
        ]);
    }
    
    /**
     * Configure the guardian for a specific user
     */
    public function forUser(User $user): static
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'user_id' => $user->id,
            ];
        });
    }
    
    /**
     * Configure the guardian with a specific number of students
     */
    public function withStudents(int $count): static
    {
        return $this->state(function (array $attributes) use ($count) {
            return [
                'total_students_managed' => $count,
            ];
        });
    }
}
