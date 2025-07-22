<?php

namespace Database\Factories;

use App\Models\DocumentUpload;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentUpload>
 */
class DocumentUploadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documentTypes = [
            DocumentUpload::TYPE_ID_FRONT,
            DocumentUpload::TYPE_ID_BACK,
            DocumentUpload::TYPE_CERTIFICATE,
            DocumentUpload::TYPE_RESUME
        ];
        
        $documentType = $this->faker->randomElement($documentTypes);
        
        // Base document data
        $data = [
            'teacher_id' => User::factory()->teacher(),
            'document_type' => $documentType,
            'file_name' => $this->faker->word() . '.' . $this->faker->randomElement(['pdf', 'jpg', 'png']),
            'file_type' => $this->faker->randomElement(['application/pdf', 'image/jpeg', 'image/png']),
            'file_size' => $this->faker->numberBetween(100000, 5000000), // 100KB to 5MB
            'verification_status' => $this->faker->randomElement([
                DocumentUpload::STATUS_PENDING,
                DocumentUpload::STATUS_VERIFIED,
                DocumentUpload::STATUS_REJECTED
            ]),
        ];
        
        // Add document type specific fields
        switch ($documentType) {
            case DocumentUpload::TYPE_ID_FRONT:
            case DocumentUpload::TYPE_ID_BACK:
                $data['id_type'] = $this->faker->randomElement([
                    'National ID', 'Passport', 'Driver\'s License', 'Residence Permit'
                ]);
                $data['issue_date'] = $this->faker->dateTimeBetween('-10 years', '-1 year');
                $data['expiry_date'] = $this->faker->dateTimeBetween('+1 year', '+10 years');
                $data['file_path'] = 'teacher_documents/placeholder_teacher_id/id/' . Str::random(20) . '.jpg';
                break;
                
            case DocumentUpload::TYPE_CERTIFICATE:
                $data['certificate_name'] = $this->faker->randomElement([
                    'Teaching Certificate', 'Quran Memorization Certificate', 'Arabic Language Proficiency',
                    'Islamic Studies Degree', 'Tajweed Certificate', 'Ijazah in Quran Recitation'
                ]);
                $data['certificate_institution'] = $this->faker->company();
                $data['issue_date'] = $this->faker->dateTimeBetween('-10 years', 'now');
                $data['file_path'] = 'teacher_documents/placeholder_teacher_id/certificates/' . Str::random(20) . '.pdf';
                break;
                
            case DocumentUpload::TYPE_RESUME:
                $data['file_path'] = 'teacher_documents/placeholder_teacher_id/resume/' . Str::random(20) . '.pdf';
                break;
        }
        
        // If document is verified, add verification details
        if ($data['verification_status'] === DocumentUpload::STATUS_VERIFIED) {
            $data['verification_notes'] = $this->faker->optional(0.7)->sentence();
            $data['verified_by'] = User::factory()->admin();
            $data['verified_at'] = $this->faker->dateTimeBetween('-1 month', 'now');
        }
        
        // If document is rejected, add rejection notes
        if ($data['verification_status'] === DocumentUpload::STATUS_REJECTED) {
            $data['verification_notes'] = $this->faker->sentence();
        }
        
        return $data;
    }
    
    /**
     * Configure the document as an ID front.
     */
    public function idFront(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'document_type' => DocumentUpload::TYPE_ID_FRONT,
                'id_type' => $this->faker->randomElement([
                    'National ID', 'Passport', 'Driver\'s License', 'Residence Permit'
                ]),
                'issue_date' => $this->faker->dateTimeBetween('-10 years', '-1 year'),
                'expiry_date' => $this->faker->dateTimeBetween('+1 year', '+10 years'),
                'file_path' => 'teacher_documents/placeholder_teacher_id/id/' . Str::random(20) . '.jpg',
                'file_name' => 'id_front.' . $this->faker->randomElement(['jpg', 'png']),
                'file_type' => $this->faker->randomElement(['image/jpeg', 'image/png']),
            ];
        });
    }
    
    /**
     * Configure the document as an ID back.
     */
    public function idBack(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'document_type' => DocumentUpload::TYPE_ID_BACK,
                'id_type' => $this->faker->randomElement([
                    'National ID', 'Passport', 'Driver\'s License', 'Residence Permit'
                ]),
                'issue_date' => $this->faker->dateTimeBetween('-10 years', '-1 year'),
                'expiry_date' => $this->faker->dateTimeBetween('+1 year', '+10 years'),
                'file_path' => 'teacher_documents/placeholder_teacher_id/id/' . Str::random(20) . '.jpg',
                'file_name' => 'id_back.' . $this->faker->randomElement(['jpg', 'png']),
                'file_type' => $this->faker->randomElement(['image/jpeg', 'image/png']),
            ];
        });
    }
    
    /**
     * Configure the document as a certificate.
     */
    public function certificate(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'document_type' => DocumentUpload::TYPE_CERTIFICATE,
                'certificate_name' => $this->faker->randomElement([
                    'Teaching Certificate', 'Quran Memorization Certificate', 'Arabic Language Proficiency',
                    'Islamic Studies Degree', 'Tajweed Certificate', 'Ijazah in Quran Recitation'
                ]),
                'certificate_institution' => $this->faker->company(),
                'issue_date' => $this->faker->dateTimeBetween('-10 years', 'now'),
                'file_path' => 'teacher_documents/placeholder_teacher_id/certificates/' . Str::random(20) . '.pdf',
                'file_name' => 'certificate.' . $this->faker->randomElement(['pdf', 'jpg', 'png']),
                'file_type' => $this->faker->randomElement(['application/pdf', 'image/jpeg', 'image/png']),
            ];
        });
    }
    
    /**
     * Configure the document as a resume/CV.
     */
    public function resume(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'document_type' => DocumentUpload::TYPE_RESUME,
                'file_path' => 'teacher_documents/placeholder_teacher_id/resume/' . Str::random(20) . '.pdf',
                'file_name' => 'resume.' . $this->faker->randomElement(['pdf', 'docx']),
                'file_type' => $this->faker->randomElement(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
            ];
        });
    }
    
    /**
     * Configure the document as pending verification.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => DocumentUpload::STATUS_PENDING,
        ]);
    }
    
    /**
     * Configure the document as verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => DocumentUpload::STATUS_VERIFIED,
            'verification_notes' => $this->faker->optional(0.7)->sentence(),
            'verified_by' => User::factory()->admin(),
            'verified_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }
    
    /**
     * Configure the document as rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => DocumentUpload::STATUS_REJECTED,
            'verification_notes' => $this->faker->sentence(),
            'verified_by' => User::factory()->admin(),
            'verified_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }
    
    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (DocumentUpload $document) {
            // Update the file_path with the actual teacher_id
            if ($document->teacher_id) {
                $document->file_path = str_replace('placeholder_teacher_id', $document->teacher_id, $document->file_path);
                $document->save();
            }
        });
    }
} 