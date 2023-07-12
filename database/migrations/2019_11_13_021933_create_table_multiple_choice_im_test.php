<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMultipleChoiceImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('multiple_choice_im_test', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('choice');
            $table->boolean('true_false');
            $table->bigInteger('question_im_test_id')->unsigned()->nullable(true);
            $table->timestamps();

            $table->foreign('question_im_test_id')->references('id')->on('question_im_test')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('multiple_choice_im_test');
    }
}
