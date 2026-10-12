<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('original_filename');
            $table->string('file_path');
            $table->integer('file_size');
            $table->longText('parsed_text')->nullable();
            $table->json('raw_skills')->nullable();
            $table->text('experience_summary')->nullable();
            $table->json('education_history')->nullable();
            $table->integer('career_confidence')->default(85);
            $table->string('detected_role')->default('Backend Developer');
            $table->enum('status', ['processing', 'completed', 'failed'])->default('completed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_profiles');
    }
};
