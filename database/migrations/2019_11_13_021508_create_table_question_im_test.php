<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableQuestionImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_im_test', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('question');
            $table->bigInteger('im_test_id')->unsigned()->nullable(true);
            $table->timestamps();

            $table->foreign('im_test_id')->references('id')->on('im_test')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('question_im_test');
    }
}
