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
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic teacher information
            $table->text('bio')->nullable();
            $table->integer('years_of_experience')->nullable();

            // Teaching subjects and specialization
            $table->json('teaching_subjects')->nullable();
            $table->string('specialization')->nullable();

            // Teaching details
            $table->string('teaching_type')->nullable(); // Online, In-person, Both
            $table->string('teaching_mode')->nullable(); // Part-time, Full-time
            $table->json('teaching_languages')->nullable(); // Languages spoken

            // Availability
            $table->json('availability_schedule')->nullable();

            // Rating snapshot (denormalized for quick access)
            $table->decimal('overall_rating', 3, 1)->nullable();
            $table->integer('total_reviews')->default(0);
            $table->integer('total_sessions_taught')->default(0);

            // Verification status
            $table->boolean('is_verified')->default(false);
            $table->timestamp('last_active_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
