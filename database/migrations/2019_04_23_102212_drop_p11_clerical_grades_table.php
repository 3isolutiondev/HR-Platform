<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropP11ClericalGradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('p11_clerical_grades');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('p11_clerical_grades', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('language_id');
            $table->integer('typing_score');
            $table->integer('shorthand_score');
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('language_id')->references('id')->on('languages');
        });
    }
}
