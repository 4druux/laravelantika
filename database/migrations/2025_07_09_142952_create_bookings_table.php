<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{  
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); 
            $table->string('public_id')->unique();
            $table->string('nama');
            $table->string('telepon');
            $table->string('paket');
            $table->dateTime('tanggal_booking');
            $table->text('catatan')->nullable();
            $table->enum('status', ['PENDING', 'CONFIRMED', 'CANCELLED'])->default('PENDING');
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};