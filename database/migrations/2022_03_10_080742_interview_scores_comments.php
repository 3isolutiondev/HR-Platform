<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InterviewScoresComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('interview_score_comments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('applicant_id');
            $table->unsignedBigInteger('manager_id');
            $table->string('comment');
            $table->boolean('editable');
            $table->timestamps();
            $table->foreign('applicant_id')->references('id')->on('job_user')->onDelete('cascade');
            $table->foreign('manager_id')->references('id')->on('job_managers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('interview_score_comments');
    }
}
