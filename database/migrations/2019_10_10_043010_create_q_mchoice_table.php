<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQMchoiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('q_mchoice', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('question');
            $table->string('true_answer', 1);
            $table->string('choice');
            $table->biginteger('im_evaluation_id')->unsigned();
            $table->timestamps();
            
            $table->foreign('im_evaluation_id')->references('id')->on('im_evaluation')->onDelete('cascade');
            
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('q_mchoice');
    }
}
