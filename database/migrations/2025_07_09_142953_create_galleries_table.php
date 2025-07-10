<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('filename'); 
            $table->string('path'); 
            $table->string('url'); 
            $table->json('categories'); 
            $table->decimal('aspect_ratio', 8, 4);
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('galleries');
    }
};
