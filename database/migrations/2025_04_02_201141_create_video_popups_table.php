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
        Schema::create('video_popups', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->index();
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['quiz', 'cta'])->default('quiz');
            $table->integer('appear_at')->comment('Time in seconds when the popup should appear');
            $table->integer('duration')->nullable()->comment('Duration in seconds the popup should be shown');
            $table->boolean('is_skippable')->default(true);
            $table->boolean('is_active')->default(true);
            $table->json('options')->nullable()->comment('For quiz: possible answers, for CTA: action buttons');
            $table->json('metadata')->nullable()->comment('Additional configuration options');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_popups');
    }
};
