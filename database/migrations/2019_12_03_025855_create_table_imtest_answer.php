<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableImtestAnswer extends Migration
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
            $table->bigInteger('follow_im_test_id')->unsigned();
            $table->bigInteger('question_im_test_id')->unsigned();

            $table->foreign('follow_im_test_id')->references('id')->on('follow_im_test')->onDelete('cascade');
            $table->foreign('question_im_test_id')->references('id')->on('question_im_test')->onDelete('cascade');

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
        Schema::dropIfExists('im_test_answer');
    }
}
