<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;
    public function up()
    {
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree');            // e.g Bachelor of Science
            $table->string('field_of_study');    // e.g Computer Science
            $table->date('start_date');
            $table->date('end_date')->nullable();
           $table->smallInteger('is_current')->default(0);
            $table->string('grade')->nullable(); // e.g 3.8 GPA
            $table->text('description')->nullable();
            $table->string('institution_logo')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('educations');
    }
};