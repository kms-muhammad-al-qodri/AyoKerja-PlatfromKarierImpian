<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_roadmaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('target_role')->default('Backend Engineer');
            $table->json('nodes')->nullable(); // array of roadmap steps
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_roadmaps');
    }
};
