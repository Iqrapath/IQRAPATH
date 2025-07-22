<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationRequest>
 */
class VerificationRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teacher_id' => User::factory()->teacher(),
            'status' => VerificationRequest::STATUS_PENDING,
            'video_status' => VerificationRequest::VIDEO_NOT_SCHEDULED,
        ];
    }

    /**
     * Configure the verification request as verified.
     */
    public function verified(): static
    {
        return $this->state(function (array $attributes) {
            $reviewedAt = $this->faker->dateTimeBetween('-1 month', 'now');
            
            return [
                'status' => VerificationRequest::STATUS_VERIFIED,
                'reviewed_by' => User::factory()->admin(),
                'reviewed_at' => $reviewedAt,
            ];
        });
    }

    /**
     * Configure the verification request as rejected.
     */
    public function rejected(): static
    {
        return $this->state(function (array $attributes) {
            $reviewedAt = $this->faker->dateTimeBetween('-1 month', 'now');
            $rejectionReasons = [
                'Documents are not clear or legible',
                'ID document is expired',
                'Certificate cannot be verified',
                'Information mismatch between documents',
                'Incomplete documentation provided',
                'Suspected fraudulent documents',
                'Failed video verification interview',
                'Qualification does not meet our requirements',
                'Background check issues',
            ];
            
            return [
                'status' => VerificationRequest::STATUS_REJECTED,
                'reviewed_by' => User::factory()->admin(),
                'reviewed_at' => $reviewedAt,
                'rejection_reason' => $this->faker->randomElement($rejectionReasons),
            ];
        });
    }

    /**
     * Configure the verification request as live_video.
     */
    public function liveVideo(): static
    {
        return $this->state(function (array $attributes) {
            $reviewedAt = $this->faker->dateTimeBetween('-1 month', 'now');
            
            return [
                'status' => VerificationRequest::STATUS_LIVE_VIDEO,
                'video_status' => VerificationRequest::VIDEO_COMPLETED,
                'reviewed_by' => User::factory()->admin(),
                'reviewed_at' => $reviewedAt,
            ];
        });
    }

    /**
     * Configure the verification request with scheduled video call.
     */
    public function withScheduledCall(): static
    {
        return $this->state(function (array $attributes) {
            $scheduledDate = $this->faker->dateTimeBetween('+1 day', '+2 weeks');
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $this->faker->randomElement($platforms);
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . $this->faker->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . $this->faker->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . $this->faker->uuid,
            ];
            
            return [
                'video_status' => VerificationRequest::VIDEO_SCHEDULED,
                'scheduled_date' => $scheduledDate,
                'video_platform' => $platform,
                'meeting_link' => $meetingLinks[$platform],
                'meeting_notes' => $this->faker->optional(0.7)->sentence(),
            ];
        });
    }

    /**
     * Configure the verification request with completed video call.
     */
    public function withCompletedCall(): static
    {
        return $this->state(function (array $attributes) {
            $scheduledDate = $this->faker->dateTimeBetween('-1 month', '-1 day');
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $this->faker->randomElement($platforms);
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . $this->faker->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . $this->faker->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . $this->faker->uuid,
            ];
            
            return [
                'video_status' => VerificationRequest::VIDEO_COMPLETED,
                'scheduled_date' => $scheduledDate,
                'video_platform' => $platform,
                'meeting_link' => $meetingLinks[$platform],
                'meeting_notes' => $this->faker->optional(0.7)->sentence(),
            ];
        });
    }

    /**
     * Configure the verification request with missed video call.
     */
    public function withMissedCall(): static
    {
        return $this->state(function (array $attributes) {
            $scheduledDate = $this->faker->dateTimeBetween('-1 month', '-1 day');
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $this->faker->randomElement($platforms);
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . $this->faker->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . $this->faker->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . $this->faker->uuid,
            ];
            
            return [
                'video_status' => VerificationRequest::VIDEO_MISSED,
                'scheduled_date' => $scheduledDate,
                'video_platform' => $platform,
                'meeting_link' => $meetingLinks[$platform],
                'meeting_notes' => $this->faker->optional(0.7)->sentence(),
            ];
        });
    }

    /**
     * Create a verification request with all required documents.
     *
     * @return $this
     */
    public function withAllDocuments(): static
    {
        return $this->afterCreating(function (VerificationRequest $verificationRequest) {
            // Create ID front document
            \App\Models\DocumentUpload::factory()
                ->idFront()
                ->for($verificationRequest->teacher, 'teacher')
                ->for($verificationRequest)
                ->create();
            
            // Create ID back document
            \App\Models\DocumentUpload::factory()
                ->idBack()
                ->for($verificationRequest->teacher, 'teacher')
                ->for($verificationRequest)
                ->create();
            
            // Create certificate document
            \App\Models\DocumentUpload::factory()
                ->certificate()
                ->for($verificationRequest->teacher, 'teacher')
                ->for($verificationRequest)
                ->create();
            
            // Create resume document
            \App\Models\DocumentUpload::factory()
                ->resume()
                ->for($verificationRequest->teacher, 'teacher')
                ->for($verificationRequest)
                ->create();
        });
    }

    /**
     * Create a verification request with random documents (1-3).
     *
     * @return $this
     */
    public function withRandomDocuments(): static
    {
        return $this->afterCreating(function (VerificationRequest $verificationRequest) {
            $documentCount = $this->faker->numberBetween(1, 3);
            
            \App\Models\DocumentUpload::factory()
                ->count($documentCount)
                ->for($verificationRequest->teacher, 'teacher')
                ->for($verificationRequest)
                ->create();
        });
    }
} 