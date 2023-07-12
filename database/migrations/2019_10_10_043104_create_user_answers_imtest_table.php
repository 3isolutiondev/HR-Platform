<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserAnswersImtestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_answers_imtest', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            $table->integer('user_id')->unsigned()->nullable();
            $table->biginteger('im_evaluation_id')->unsigned();
            
            $table->bigInteger('q_mchoice_id')->unsigned()->nullable();
            $table->string('answers', 1);
            
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('q_mchoice_id')->references('id')->on('q_mchoice');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_answers_imtest');
    }
}
