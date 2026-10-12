<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company_name');
            $table->string('location');
            $table->string('work_type')->default('Hybrid'); // Remote, Hybrid, Onsite
            $table->string('salary_range')->nullable(); // e.g. Rp 6M - 9M
            $table->json('required_skills')->nullable();
            $table->text('description')->nullable();
            $table->string('apply_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
