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
        Schema::create('guardian_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic guardian information
            $table->string('relationship_to_student')->nullable();
            $table->string('occupation')->nullable();
            $table->string('secondary_phone')->nullable();
            $table->string('secondary_email')->nullable();

            // Address details
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();

            // Student monitoring
            $table->boolean('receive_progress_reports')->default(true);
            $table->boolean('receive_session_notifications')->default(true);
            $table->string('preferred_contact_method')->default('email');

            // Payment and billing information
            $table->string('billing_name')->nullable();
            $table->string('billing_address')->nullable();
            $table->string('tax_id')->nullable();

            // Additional emergency contacts
            $table->string('alternate_contact_name')->nullable();
            $table->string('alternate_contact_relationship')->nullable();
            $table->string('alternate_contact_phone')->nullable();

            // Activity tracking
            $table->timestamp('last_login_at')->nullable();
            $table->integer('total_students_managed')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardian_profiles');
    }
};
