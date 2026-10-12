<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambah kolom `language` ke tabel users untuk menyimpan preferensi bahasa platform.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('language', 10)->default('id')->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('language');
        });
    }
};

