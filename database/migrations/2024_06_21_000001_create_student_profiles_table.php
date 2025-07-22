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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic student information
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('education_level')->nullable();
            $table->string('age_group')->nullable(); // child, teenager, adult
            $table->string('school_name')->nullable();
            $table->string('grade_level')->nullable();

            // Learning information
            $table->json('subjects_of_interest')->nullable();
            $table->text('learning_goals')->nullable();
            $table->text('learning_difficulties')->nullable();
            $table->string('learning_style')->nullable();

            // Guardian information
            $table->foreignId('guardian_id')->nullable()->constrained('users');
            $table->boolean('is_child_account')->default(false);

            // Learning preferences
            $table->string('preferred_learning_method')->nullable();
            $table->string('preferred_teacher_gender')->nullable();

            // Progress tracking
            $table->integer('total_sessions_attended')->default(0);
            $table->decimal('attendance_rate', 5, 2)->nullable();
            $table->timestamp('last_session_at')->nullable();
            $table->text('teacher_feedback')->nullable();

            // Medical and emergency information
            $table->text('medical_information')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
