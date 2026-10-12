<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interview_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('target_role')->default('Backend Developer');
            $table->enum('difficulty', ['Junior', 'Intermediate', 'Advanced'])->default('Intermediate');
            $table->text('question');
            $table->text('user_answer')->nullable();
            $table->integer('technical_score')->default(0);
            $table->integer('communication_score')->default(0);
            $table->integer('relevance_score')->default(0);
            $table->integer('overall_score')->default(0);
            $table->json('feedback')->nullable(); // positive, missing, improvement, stronger_example
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_sessions');
    }
};
