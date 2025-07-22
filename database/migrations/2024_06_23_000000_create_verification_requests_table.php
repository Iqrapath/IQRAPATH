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
        Schema::create('verification_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            
            // Verification request status
            $table->enum('status', ['pending', 'verified', 'rejected', 'live_video'])->default('pending');
            
            // Video verification details
            $table->enum('video_status', ['not_scheduled', 'scheduled', 'completed', 'missed'])->default('not_scheduled');
            $table->dateTime('scheduled_date')->nullable();
            $table->string('video_platform')->nullable(); // Google Meet, Zoom, etc.
            $table->string('meeting_link')->nullable();
            $table->text('meeting_notes')->nullable();
            
            // Admin review information
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index(['teacher_id', 'status']);
            $table->index(['video_status', 'scheduled_date']);
        });
        
        // Add verification_request_id to document_uploads table
        Schema::table('document_uploads', function (Blueprint $table) {
            $table->foreignId('verification_request_id')->nullable()->after('teacher_id')
                  ->constrained('verification_requests')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_uploads', function (Blueprint $table) {
            $table->dropForeign(['verification_request_id']);
            $table->dropColumn('verification_request_id');
        });
        
        Schema::dropIfExists('verification_requests');
    }
}; 