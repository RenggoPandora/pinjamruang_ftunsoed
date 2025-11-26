<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservation_requests', function (Blueprint $table) {
            $table->timestamp('tanggal_approval_sco')->nullable()->after('catatan_sco');
            $table->timestamp('tanggal_approval_wd')->nullable()->after('catatan_wd');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_requests', function (Blueprint $table) {
            $table->dropColumn(['tanggal_approval_sco', 'tanggal_approval_wd']);
        });
    }
};
