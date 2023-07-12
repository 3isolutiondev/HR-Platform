<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInterviewScoreTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('interview_scores', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('applicant_id');
            $table->unsignedBigInteger('interview_question_id');
            $table->integer('score');
            $table->boolean('editable');
            $table->timestamps();
            $table->foreign('applicant_id')->references('id')->on('job_user')->onDelete('cascade');
            $table->foreign('interview_question_id')->references('id')->on('interview_questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('interview_scores');
    }
}
