<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImEvaluationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('im_evaluation', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('steps');
            $table->string('title');
            $table->text('text1');
            $table->string('file_dataset1');
//            $table->string('file_answer_dataset1');
            $table->string('file_dataset2');
//            $table->string('file_answer_dataset2');
            $table->string('file_dataset3');
//            $table->string('file_answer_dataset3');
            $table->json('question_title1');
            $table->json('answers1');
            $table->json('true_answers1');
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
        Schema::dropIfExists('im_evaluation');
    }
}
