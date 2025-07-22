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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('user_role', ['teacher', 'student'])->index();

            // Schedule details
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])->index();
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->boolean('is_recurring')->default(true);

            // For non-recurring dates
            $table->date('specific_date')->nullable();

            // Additional information
            $table->string('title')->nullable();
            $table->text('notes')->nullable();
            $table->string('timezone')->default('UTC');

            // For tracking schedule changes
            $table->foreignId('updated_by')->nullable()->constrained('users');

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'day_of_week', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
