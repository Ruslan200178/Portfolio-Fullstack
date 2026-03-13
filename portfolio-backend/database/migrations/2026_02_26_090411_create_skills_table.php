<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;
    public function up()
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('percentage');       // 0 - 100
            $table->string('category');          // Frontend, Backend, Tools, etc.
            $table->string('icon')->nullable();  // icon class or image
            $table->string('color')->nullable(); // hex color e.g #3B82F6
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skills');
    }
};