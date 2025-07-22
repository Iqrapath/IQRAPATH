<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rating;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\TeachingSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all teachers with profiles
        $teachers = User::where('role', 'teacher')
            ->whereHas('teacherProfile')
            ->get();
        
        // Get all students
        $students = User::where('role', 'student')->get();
        
        if ($students->isEmpty()) {
            $this->command->info('No students found to create ratings. Skipping rating seeding.');
            return;
        }
        
        // Get teaching sessions
        $teachingSessions = TeachingSession::all();
        
        // Clear existing ratings to avoid unique constraint violations
        Rating::query()->delete();
        
        foreach ($teachers as $teacher) {
            // Get teacher's sessions or create dummy ratings if no sessions exist
            $teacherSessions = $teachingSessions->where('teacher_id', $teacher->id);
            
            // Track which student-session-category combinations we've already used
            $usedCombinations = [];
            
            // Number of ratings to create (5-20)
            $ratingsCount = rand(5, 20);
            
            for ($i = 0; $i < $ratingsCount; $i++) {
                // Randomly select a student as the rater
                $student = $students->random();
                
                // Use an actual session if available, otherwise null
                $sessionId = null;
                if ($teacherSessions->isNotEmpty()) {
                    $session = $teacherSessions->random();
                    $sessionId = $session->id;
                }
                
                // Create a unique key for this combination
                $overallKey = "{$student->id}-{$sessionId}-overall";
                
                // Skip if we've already used this combination
                if (in_array($overallKey, $usedCombinations)) {
                    continue;
                }
                
                // Add to used combinations
                $usedCombinations[] = $overallKey;
                
                // Create overall rating
                $overallRating = $this->createRating($student, $teacher, $sessionId, 'overall');
                
                // 70% chance to add category-specific ratings
                if (rand(1, 100) <= 70) {
                    $this->createCategoryRatings($student, $teacher, $sessionId, $overallRating->rating_value, $usedCombinations);
                }
            }
            
            // Update the teacher profile with the new ratings
            $teacherProfile = TeacherProfile::where('user_id', $teacher->id)->first();
            if ($teacherProfile) {
                $teacherProfile->updateRatingStatistics();
            }
        }
        
        $this->command->info('Ratings seeded successfully!');
    }
    
    /**
     * Create a rating record.
     */
    private function createRating(User $student, User $teacher, ?int $sessionId, string $category): Rating
    {
        // Base rating value between 3.0 and 5.0 (most ratings are positive)
        $ratingValue = rand(30, 50) / 10;
        
        // Occasionally add lower ratings (10% chance)
        if (rand(1, 100) <= 10) {
            $ratingValue = rand(10, 29) / 10;
        }
        
        // Create the rating
        return Rating::create([
            'rater_id' => $student->id,
            'ratee_id' => $teacher->id,
            'teaching_session_id' => $sessionId,
            'category' => $category,
            'rating_value' => $ratingValue,
            'review_text' => $this->getRandomReviewText($category, $ratingValue),
            'is_public' => rand(1, 100) <= 90, // 90% are public
            'is_anonymous' => rand(1, 100) <= 20, // 20% are anonymous
            'created_at' => Carbon::now()->subDays(rand(1, 90)),
        ]);
    }
    
    /**
     * Create category-specific ratings.
     */
    private function createCategoryRatings(User $student, User $teacher, ?int $sessionId, float $baseRating, array &$usedCombinations): void
    {
        $categories = ['reading', 'writing', 'speaking', 'knowledge', 'punctuality', 'communication', 'teaching_quality'];
        
        // Shuffle and pick 2-4 categories
        shuffle($categories);
        $selectedCategories = array_slice($categories, 0, rand(2, 4));
        
        foreach ($selectedCategories as $category) {
            // Create a unique key for this combination
            $key = "{$student->id}-{$sessionId}-{$category}";
            
            // Skip if we've already used this combination
            if (in_array($key, $usedCombinations)) {
                continue;
            }
            
            // Add to used combinations
            $usedCombinations[] = $key;
            
            // Vary the rating slightly from the base rating (-0.5 to +0.5)
            $variation = (rand(-5, 5) / 10);
            $ratingValue = max(1, min(5, $baseRating + $variation));
            
            Rating::create([
                'rater_id' => $student->id,
                'ratee_id' => $teacher->id,
                'teaching_session_id' => $sessionId,
                'category' => $category,
                'rating_value' => $ratingValue,
                'review_text' => null, // Only the overall rating has review text
                'is_public' => true,
                'is_anonymous' => false,
                'created_at' => Carbon::now()->subDays(rand(1, 90)),
            ]);
        }
    }
    
    /**
     * Get random review text based on rating category and value.
     */
    private function getRandomReviewText(string $category, float $rating): ?string
    {
        // 80% chance to have review text
        if (rand(1, 100) > 80) {
            return null;
        }
        
        $positiveReviews = [
            'Excellent teacher! Very knowledgeable and patient.',
            'I learned so much in such a short time. Highly recommended!',
            'The teacher has a great teaching style that makes complex topics easy to understand.',
            'Very professional and always on time. Great communication skills.',
            'My Quran recitation has improved significantly thanks to this teacher.',
            'The teacher is very attentive and provides helpful feedback.',
            'I appreciate the structured approach to learning Arabic.',
            'The teacher is very encouraging and creates a positive learning environment.',
            'Very thorough and detailed in explanations. Answers all questions clearly.',
            'The sessions are always well-prepared and productive.',
        ];
        
        $neutralReviews = [
            'Good teacher overall. Could improve on providing more practice materials.',
            'The sessions are helpful but sometimes feel rushed.',
            'Knowledgeable teacher but could be more engaging.',
            'Decent teaching style but needs more structure.',
            'The teacher knows the subject well but could explain concepts more clearly.',
        ];
        
        $negativeReviews = [
            'Often late to sessions and seems unprepared.',
            'Difficult to understand explanations sometimes.',
            'Not very responsive to questions outside of class time.',
            'Teaching style doesn\'t match my learning needs.',
            'Sessions feel disorganized and lack clear objectives.',
        ];
        
        if ($rating >= 4.0) {
            return $positiveReviews[array_rand($positiveReviews)];
        } elseif ($rating >= 3.0) {
            return $neutralReviews[array_rand($neutralReviews)];
        } else {
            return $negativeReviews[array_rand($negativeReviews)];
        }
    }
} 