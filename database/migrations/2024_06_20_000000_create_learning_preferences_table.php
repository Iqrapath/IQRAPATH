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
        Schema::create('learning_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Preferred Subjects (storing as JSON array)
            $table->json('preferred_subjects')->nullable();

            // Teaching Mode
            $table->enum('teaching_mode', ['full-time', 'part-time'])->nullable();

            // Student Age Group
            $table->string('student_age_group')->nullable();

            // Preferred Learning Times (storing as JSON)
            $table->json('preferred_learning_times')->nullable();

            // Additional Notes
            $table->text('additional_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_preferences');
    }
};
