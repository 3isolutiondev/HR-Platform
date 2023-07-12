<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImTestAnswerTableM extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('im_test_answer', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('profil_id')->unsigned();
            $table->bigInteger('im_test_id')->unsigned();
            $table->bigInteger('question_im_test_id')->unsigned();
            $table->bigInteger('multiple_choice_im_test_id')->unsigned();
            $table->timestamps();

            $table->foreign('profil_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('im_test_id')->references('id')->on('im_test')->onDelete('cascade');
            $table->foreign('question_im_test_id')->references('id')->on('question_im_test')->onDelete('cascade');
            $table->foreign('multiple_choice_im_test_id')->references('id')->on('multiple_choice_im_test');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('im_test_answer');
    }
}
