<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApplicantTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicant', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('file_answers1');
            $table->string('file_answers2');
            $table->string('file_answers3');
            $table->json('quiz_answers');
            $table->integer('user_id')->unsigned()->nullable();
            $table->biginteger('im_evaluation_id')->unsigned();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('im_evaluation_id')->references('id')->on('im_evaluation');
            
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
        Schema::dropIfExists('applicant');
    }
}
