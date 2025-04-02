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
        Schema::create('video_popup_submissions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->index();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('video_popup_id')->constrained()->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained()->comment('For quicker queries');
            $table->text('answer')->nullable()->comment('User submitted answer');
            $table->json('answer_data')->nullable()->comment('Additional answer data, e.g., selected options');
            $table->boolean('is_correct')->nullable()->comment('Whether the answer is correct (for quizzes)');
            $table->timestamp('responded_at')->useCurrent();
            $table->integer('response_time_seconds')->nullable()->comment('Time taken to respond');
            $table->json('metadata')->nullable()->comment('Additional metadata');
            $table->timestamps();

            // Create a unique constraint to prevent duplicate submissions
            $table->unique(['user_id', 'video_popup_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_popup_submissions');
    }
};
