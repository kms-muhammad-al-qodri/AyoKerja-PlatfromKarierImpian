<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('job_posting_id')->constrained('job_postings')->cascadeOnDelete();
            $table->integer('match_percentage')->default(90);
            $table->integer('technical_skills_score')->default(95);
            $table->integer('experience_score')->default(88);
            $table->integer('education_score')->default(100);
            $table->integer('career_interest_score')->default(95);
            $table->json('matched_skills')->nullable();
            $table->json('missing_skills')->nullable();
            $table->text('ai_explanation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_matches');
    }
};
