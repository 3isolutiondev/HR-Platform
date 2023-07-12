<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMchoiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mchoice', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('answer');
            
            $table->bigInteger('q_mchoice_id')->unsigned()->nullable();
            $table->biginteger('im_evaluation_id')->unsigned();
            $table->foreign('q_mchoice_id')->references('id')->on('q_mchoice')->onDelete('cascade');
            
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
        Schema::dropIfExists('mchoice');
    }
}
