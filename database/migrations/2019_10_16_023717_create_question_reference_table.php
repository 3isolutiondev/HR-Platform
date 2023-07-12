<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionReferenceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_reference', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("question");
            
            $table->bigInteger("category_question_reference_id")->unsigned();
            
            $table->foreign('category_question_reference_id')->references('id')->on('category_question_reference')->onDelete('cascade');
            
            
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
        Schema::dropIfExists('question_reference');
    }
}
