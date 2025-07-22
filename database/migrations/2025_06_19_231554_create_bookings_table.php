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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique(); // Format: BK-YYMMDD-XXXX
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('restrict');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            
            // Booking details
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration')->comment('Duration in minutes');
            
            // Status and tracking
            $table->enum('status', [
                'pending', 
                'approved', 
                'rejected', 
                'upcoming', 
                'completed', 
                'missed', 
                'cancelled'
            ])->default('pending');
            
            // Additional information
            $table->text('notes')->nullable();
            $table->foreignId('previous_booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('rescheduled_at')->nullable();
            
            // Timestamps for status changes
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for common queries
            $table->index(['teacher_id', 'date', 'status']);
            $table->index(['student_id', 'date', 'status']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
