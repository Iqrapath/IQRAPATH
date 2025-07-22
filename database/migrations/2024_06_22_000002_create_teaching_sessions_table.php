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
        Schema::create('teaching_sessions', function (Blueprint $table) {
            $table->id();

            // Participants
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guardian_id')->nullable()->constrained('users');

            // Session details
            $table->dateTime('scheduled_start_time');
            $table->dateTime('scheduled_end_time');
            $table->dateTime('actual_start_time')->nullable();
            $table->dateTime('actual_end_time')->nullable();
            $table->integer('duration_minutes')->nullable();

            // Subject and content
            $table->string('subject');
            $table->foreignId('subscription_plan_id')->nullable()->constrained('subscription_plans');
            $table->text('session_topic')->nullable();
            $table->text('session_objectives')->nullable();
            $table->string('teaching_method')->nullable();

            // Session status and lifecycle
            $table->enum('status', [
                'scheduled',
                'confirmed',
                'in_progress',
                'completed',
                'cancelled_by_teacher',
                'cancelled_by_student',
                'cancelled_by_guardian',
                'cancelled_by_admin',
                'no_show'
            ])->default('scheduled');

            // Session notes
            $table->text('teacher_notes')->nullable();
            $table->text('student_notes')->nullable();
            $table->text('guardian_notes')->nullable();

            // Tracking
            $table->string('meeting_link')->nullable();
            $table->string('recording_link')->nullable();
            $table->text('resources_used')->nullable();
            $table->text('homework_assigned')->nullable();

            // Timestamps
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['teacher_id', 'scheduled_start_time']);
            $table->index(['student_id', 'scheduled_start_time']);
            $table->index(['status', 'scheduled_start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teaching_sessions');
    }
};
