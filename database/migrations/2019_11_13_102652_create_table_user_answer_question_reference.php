<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUserAnswerQuestionReference extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_answer_question_reference', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email_reference', 100)->nullable(true);
            $table->bigInteger('question_reference_id')->unsigned()->nullable(true);
            $table->integer('user_id')->unsigned()->nullable(true);
            $table->text('answer');
            $table->timestamps();

            $table->foreign('question_reference_id')->references('id')->on('question_reference');
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
        Schema::dropIfExists('user_answer_question_reference');
    }
}
