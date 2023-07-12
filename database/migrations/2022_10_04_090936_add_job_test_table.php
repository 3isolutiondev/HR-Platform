<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddJobTestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_user_tests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_user_id');
            $table->text('test_link');
            $table->integer('test_score');
            $table->string('position_to_interview_step');
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
        Schema::dropIfExists('job_user_tests');
    }
}
