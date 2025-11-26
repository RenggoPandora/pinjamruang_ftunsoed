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
        Schema::create('reservation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ruang_id')->constrained('ruangs')->onDelete('cascade');
            $table->foreignId('organisasi_id')->constrained('organisasis')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('jumlah_orang');
            $table->text('deskripsi_acara');
            $table->string('surat_pengajuan')->nullable();
            $table->enum('status', [
                'pending',
                'approved_sco',
                'rejected_sco',
                'pending_wd',
                'approved_wd',
                'rejected_wd'
            ])->default('pending');
            $table->text('catatan_sco')->nullable();
            $table->text('catatan_wd')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_requests');
    }
};
