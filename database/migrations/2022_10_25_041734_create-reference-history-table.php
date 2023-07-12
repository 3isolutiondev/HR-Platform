<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReferenceHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reference_history', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('reference_id')->unsigned();
            $table->foreign('reference_id')->references('id')->on('p11_references');
            $table->string('code')->nullable();
            $table->unsignedInteger('job_id')->nullable();
            $table->foreign('job_id')->references('id')->on('jobs');
            $table->unsignedInteger('reference_sender_id')->nullable();
            $table->foreign('reference_sender_id')->references('id')->on('users');
            $table->unsignedBigInteger('roster_process_id')->nullable();
            $table->foreign('roster_process_id')->references('id')->on('roster_processes');
            $table->unsignedInteger('attachment_id')->nullable();
            $table->foreign('attachment_id')->references('id')->on('attachments');
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
        Schema::dropIfExists('reference_history');
    }
}
