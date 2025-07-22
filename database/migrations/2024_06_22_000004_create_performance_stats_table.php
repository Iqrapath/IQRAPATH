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
        Schema::create('performance_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('user_role', ['teacher', 'student'])->index();

            // Stat type and value
            $table->string('stat_type')->index(); // total_sessions, average_rating, attendance_rate, etc.
            $table->decimal('stat_value', 10, 2); // Can store percentages, counts, averages

            // For time-based stats
            $table->enum('period_type', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'all_time'])->default('all_time');
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();

            // For categorized stats
            $table->string('category')->nullable(); // subject, skill, etc.

            // For tracking
            $table->timestamp('last_updated_at')->useCurrent();
            $table->timestamp('next_update_due')->nullable();

            // Additional details
            $table->json('breakdown')->nullable(); // For storing detailed breakdown of the stat
            $table->text('notes')->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'stat_type', 'period_type']);
            $table->unique(['user_id', 'stat_type', 'period_type', 'category'], 'unique_user_stat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_stats');
    }
};
