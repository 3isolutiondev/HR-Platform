<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUserAnswerQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_answer_im_test', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->unsigned();
            $table->bigInteger('question_im_test_id')->unsigned()->nullable(true);
            $table->bigInteger('multiple_choice_im_test_id')->unsigned()->nullable(true);
            $table->timestamps();

            $table->foreign('question_im_test_id')->references('id')->on('question_im_test');
            $table->foreign('multiple_choice_im_test_id')->references('id')->on('multiple_choice_im_test');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_answer_im_test');
    }
}
