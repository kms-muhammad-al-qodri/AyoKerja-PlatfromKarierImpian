<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_gaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('target_role')->default('Backend Developer');
            $table->json('current_capabilities')->nullable();
            $table->json('high_priority')->nullable();
            $table->json('medium_priority')->nullable();
            $table->json('low_priority')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_gaps');
    }
};
