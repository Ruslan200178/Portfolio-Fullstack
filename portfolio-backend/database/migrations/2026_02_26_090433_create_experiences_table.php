<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();   // null = present
            $table->boolean('is_current')->default(false);
            $table->longText('description');
            $table->string('company_logo')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('experiences');
    }
};