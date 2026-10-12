<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'location')) {
                $table->string('location')->nullable()->after('career_goal');
            }
            if (!Schema::hasColumn('users', 'work_mode')) {
                $table->string('work_mode')->nullable()->after('location');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'location')) {
                $table->dropColumn('location');
            }
            if (Schema::hasColumn('users', 'work_mode')) {
                $table->dropColumn('work_mode');
            }
        });
    }
};
