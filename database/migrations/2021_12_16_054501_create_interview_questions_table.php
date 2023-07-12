<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInterviewQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('interview_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_manager_id');
            $table->string('question');
            $table->boolean('editable');
            $table->timestamps();
            $table->foreign('job_manager_id')->references('id')->on('job_managers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('interview_questions');
    }
}
