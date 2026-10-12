<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cv_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cv_profile_id')->nullable()->constrained('cv_profiles')->cascadeOnDelete();
            $table->integer('overall_score')->default(86);
            $table->integer('content_score')->default(90);
            $table->integer('structure_score')->default(91);
            $table->integer('skills_score')->default(88);
            $table->integer('experience_score')->default(82);
            $table->integer('impact_score')->default(76);
            $table->json('strengths')->nullable();
            $table->json('opportunities')->nullable();
            $table->text('ai_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cv_analyses');
    }
};
