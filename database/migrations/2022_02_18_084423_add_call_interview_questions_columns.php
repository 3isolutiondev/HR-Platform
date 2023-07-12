<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddCallInterviewQuestionsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('interview_scores');
        Schema::dropIfExists('interview_questions');
        Schema::create('interview_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('question_type')->default('number');
            $table->string('question');
            $table->boolean('editable');
            $table->unsignedInteger('job_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

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
        Schema::dropIfExists('interview_questions');
    }
}
