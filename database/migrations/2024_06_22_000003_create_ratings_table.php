<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();

            // Who is rating and who is being rated
            $table->foreignId('rater_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ratee_id')->constrained('users')->onDelete('cascade');

            // What session this rating is for
            $table->foreignId('teaching_session_id')->nullable()->constrained()->onDelete('cascade');

            // Rating details
            $table->enum('category', ['overall', 'reading', 'writing', 'speaking', 'knowledge', 'punctuality', 'communication', 'teaching_quality', 'learning_progress']);
            $table->decimal('rating_value', 3, 1); // Allows ratings like 4.5
            $table->text('review_text')->nullable();

            // For teacher-specific ratings
            $table->json('skill_ratings')->nullable(); // For storing multiple skill ratings in one review

            // For tracking and moderation
            $table->boolean('is_public')->default(true);
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_flagged')->default(false);
            $table->text('flagged_reason')->nullable();
            $table->foreignId('moderated_by')->nullable()->constrained('users');
            $table->timestamp('moderated_at')->nullable();

            // Timestamps
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['ratee_id', 'category']);
            $table->index(['teaching_session_id']);

            // Ensure a user can only rate once per session per category
            $table->unique(['rater_id', 'teaching_session_id', 'category'], 'unique_session_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
