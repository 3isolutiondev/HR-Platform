<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableJobsInterviewFiles extends Migration
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
            $table->unsignedInteger('job_user_id');
            $table->bigInteger('media_id')->nullable();
            $table->bigInteger('attachments_id')->nullable();
            $table->string('file_name')->nullable();
            $table->string('download_url')->nullable();
            $table->timestamps();

            $table->foreign('job_user_id')->references('id')->on('job_user')->onDelete('cascade');

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
