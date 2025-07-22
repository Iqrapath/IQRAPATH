<?php

namespace Database\Seeders;

use App\Models\DocumentUpload;
use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VerificationRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user for verification reviews
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@iqrapath.com',
        ]);

        // Create pending verification requests with different document combinations
        $this->createPendingVerifications(10);
        
        // Create verified teachers with complete documents
        $this->createVerifiedTeachers(5, $admin->id);
        
        // Create rejected verification requests
        $this->createRejectedVerifications(3, $admin->id);
        
        // Create verification requests with live video status
        $this->createLiveVideoVerifications(4, $admin->id);
        
        // Create verification requests with scheduled video calls
        $this->createVerificationsWithScheduledCalls(4);
        
        // Create verification requests with completed video calls
        $this->createVerificationsWithCompletedCalls(3, $admin->id);
        
        // Create verification requests with missed video calls
        $this->createVerificationsWithMissedCalls(2);
    }
    
    /**
     * Create pending verification requests with different document combinations.
     */
    private function createPendingVerifications(int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->unverified()
                ->create();
            
            // Create verification request
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create();
            
            // Randomly decide how many documents to create
            $documentTypes = [
                DocumentUpload::TYPE_ID_FRONT,
                DocumentUpload::TYPE_ID_BACK,
                DocumentUpload::TYPE_CERTIFICATE,
                DocumentUpload::TYPE_RESUME
            ];
            
            // Shuffle and take a random number of documents (at least 1)
            shuffle($documentTypes);
            $selectedTypes = array_slice($documentTypes, 0, rand(1, count($documentTypes)));
            
            foreach ($selectedTypes as $type) {
                switch ($type) {
                    case DocumentUpload::TYPE_ID_FRONT:
                        DocumentUpload::factory()
                            ->idFront()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_ID_BACK:
                        DocumentUpload::factory()
                            ->idBack()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_CERTIFICATE:
                        DocumentUpload::factory()
                            ->certificate()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_RESUME:
                        DocumentUpload::factory()
                            ->resume()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                }
            }
        }
    }
    
    /**
     * Create verified teachers with complete documents.
     */
    private function createVerifiedTeachers(int $count, int $adminId): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->create([
                    'is_verified' => true
                ]);
            
            // Create verification request
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create([
                    'status' => VerificationRequest::STATUS_VERIFIED,
                    'reviewed_by' => $adminId,
                    'reviewed_at' => now()->subDays(rand(1, 30)),
                ]);
            
            // Create all required documents
            DocumentUpload::factory()
                ->idFront()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->idBack()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->certificate()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->resume()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
        }
    }
    
    /**
     * Create rejected verification requests.
     */
    private function createRejectedVerifications(int $count, int $adminId): void
    {
        $rejectionReasons = [
            'Documents are not clear or legible',
            'ID document is expired',
            'Certificate cannot be verified',
            'Information mismatch between documents',
            'Incomplete documentation provided',
            'Suspected fraudulent documents',
        ];
        
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->unverified()
                ->create();
            
            // Create verification request
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create([
                    'status' => VerificationRequest::STATUS_REJECTED,
                    'reviewed_by' => $adminId,
                    'reviewed_at' => now()->subDays(rand(1, 30)),
                    'rejection_reason' => $rejectionReasons[array_rand($rejectionReasons)],
                ]);
            
            // Create random documents (2-4)
            $documentCount = rand(2, 4);
            DocumentUpload::factory()
                ->count($documentCount)
                ->rejected()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
        }
    }
    
    /**
     * Create verification requests with live video status.
     */
    private function createLiveVideoVerifications(int $count, int $adminId): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->unverified()
                ->create();
            
            // Create verification request with live video status
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->liveVideo()
                ->create([
                    'reviewed_by' => $adminId,
                    'reviewed_at' => now()->subDays(rand(1, 10)),
                    'video_status' => VerificationRequest::VIDEO_COMPLETED,
                ]);
            
            // Create all required documents
            DocumentUpload::factory()
                ->idFront()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->idBack()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->certificate()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->resume()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
        }
    }
    
    /**
     * Create verification requests with scheduled video calls.
     */
    private function createVerificationsWithScheduledCalls(int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->unverified()
                ->create();
            
            // Create verification request with scheduled call
            $scheduledDate = now()->addDays(rand(1, 14))->setTime(rand(9, 17), 0);
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $platforms[array_rand($platforms)];
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . fake()->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . fake()->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . fake()->uuid,
            ];
            
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create([
                    'status' => VerificationRequest::STATUS_PENDING,
                    'video_status' => VerificationRequest::VIDEO_SCHEDULED,
                    'scheduled_date' => $scheduledDate,
                    'video_platform' => $platform,
                    'meeting_link' => $meetingLinks[$platform],
                    'meeting_notes' => fake()->optional(0.7)->sentence(),
                ]);
            
            // Create all required documents
            DocumentUpload::factory()
                ->idFront()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->idBack()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->certificate()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
                
            DocumentUpload::factory()
                ->resume()
                ->pending()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create();
        }
    }
    
    /**
     * Create verification requests with completed video calls.
     */
    private function createVerificationsWithCompletedCalls(int $count, int $adminId): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->create([
                    'is_verified' => true
                ]);
            
            // Create verification request with completed call
            $scheduledDate = now()->subDays(rand(1, 14))->setTime(rand(9, 17), 0);
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $platforms[array_rand($platforms)];
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . fake()->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . fake()->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . fake()->uuid,
            ];
            
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create([
                    'status' => VerificationRequest::STATUS_VERIFIED,
                    'video_status' => VerificationRequest::VIDEO_COMPLETED,
                    'scheduled_date' => $scheduledDate,
                    'video_platform' => $platform,
                    'meeting_link' => $meetingLinks[$platform],
                    'meeting_notes' => fake()->optional(0.7)->sentence(),
                    'reviewed_by' => $adminId,
                    'reviewed_at' => now()->subDays(rand(1, 10)),
                ]);
            
            // Create all required documents
            DocumentUpload::factory()
                ->idFront()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->idBack()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->certificate()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
                
            DocumentUpload::factory()
                ->resume()
                ->verified()
                ->for($teacher, 'teacher')
                ->for($request)
                ->create([
                    'verified_by' => $adminId,
                    'verified_at' => $request->reviewed_at,
                ]);
        }
    }
    
    /**
     * Create verification requests with missed video calls.
     */
    private function createVerificationsWithMissedCalls(int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            // Create a teacher
            $teacher = User::factory()
                ->teacher()
                ->create();
            
            // Create teacher profile
            $profile = TeacherProfile::factory()
                ->for($teacher, 'user')
                ->unverified()
                ->create();
            
            // Create verification request with missed call
            $scheduledDate = now()->subDays(rand(1, 14))->setTime(rand(9, 17), 0);
            $platforms = ['Google Meet', 'Zoom', 'Microsoft Teams'];
            $platform = $platforms[array_rand($platforms)];
            
            $meetingLinks = [
                'Google Meet' => 'https://meet.google.com/' . fake()->regexify('[a-z]{3}-[a-z]{4}-[a-z]{3}'),
                'Zoom' => 'https://zoom.us/j/' . fake()->numberBetween(10000000000, 99999999999),
                'Microsoft Teams' => 'https://teams.microsoft.com/l/meetup-join/' . fake()->uuid,
            ];
            
            $request = VerificationRequest::factory()
                ->for($teacher, 'teacher')
                ->create([
                    'status' => VerificationRequest::STATUS_PENDING,
                    'video_status' => VerificationRequest::VIDEO_MISSED,
                    'scheduled_date' => $scheduledDate,
                    'video_platform' => $platform,
                    'meeting_link' => $meetingLinks[$platform],
                    'meeting_notes' => fake()->optional(0.7)->sentence(),
                ]);
            
            // Create random documents (2-4)
            $documentTypes = [
                DocumentUpload::TYPE_ID_FRONT,
                DocumentUpload::TYPE_ID_BACK,
                DocumentUpload::TYPE_CERTIFICATE,
                DocumentUpload::TYPE_RESUME
            ];
            
            // Shuffle and take a random number of documents (at least 2)
            shuffle($documentTypes);
            $selectedTypes = array_slice($documentTypes, 0, rand(2, count($documentTypes)));
            
            foreach ($selectedTypes as $type) {
                switch ($type) {
                    case DocumentUpload::TYPE_ID_FRONT:
                        DocumentUpload::factory()
                            ->idFront()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_ID_BACK:
                        DocumentUpload::factory()
                            ->idBack()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_CERTIFICATE:
                        DocumentUpload::factory()
                            ->certificate()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                    case DocumentUpload::TYPE_RESUME:
                        DocumentUpload::factory()
                            ->resume()
                            ->pending()
                            ->for($teacher, 'teacher')
                            ->for($request)
                            ->create();
                        break;
                }
            }
        }
    }
} 