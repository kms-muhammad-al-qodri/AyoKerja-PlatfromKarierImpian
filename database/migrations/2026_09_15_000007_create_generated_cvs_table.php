<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cv_profile_id')->nullable()->constrained('cv_profiles')->nullOnDelete();
            $table->string('template_name')->default('Harvard_ATS');
            $table->string('full_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->text('summary')->nullable();
            $table->json('experiences')->nullable();
            $table->json('education')->nullable();
            $table->json('projects')->nullable();
            $table->json('skills')->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('is_ats_optimized')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_cvs');
    }
};
