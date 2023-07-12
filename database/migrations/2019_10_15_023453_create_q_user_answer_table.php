<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQUserAnswerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('q_user_answer', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->integer('user_id')->unsigned()->nullable();
            
            $table->bigInteger('q_mchoice_id')->unsigned()->nullable();
            $table->bigInteger('mchoice_id')->unsigned()->nullable();
            
            $table->foreign('q_mchoice_id')->references('id')->on('q_mchoice');
            
            $table->foreign('mchoice_id')->references('id')->on('mchoice');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('q_user_answer');
    }
}
