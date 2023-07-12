<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableJobsInterviewFilesAgain extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs_interview_files', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('job_id')->nullable();
            $table->bigInteger('media_id')->nullable();
            $table->bigInteger('attachments_id')->nullable();
            $table->string('file_name')->nullable();
            $table->string('download_url')->nullable();
            $table->timestamps();
            $table->unsignedInteger('user_interview_id');
            $table->string('user_interview_name');
            $table->string('user_interview_email');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_interview_id')->references('id')->on('users');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs_interview_files');
    }
}
