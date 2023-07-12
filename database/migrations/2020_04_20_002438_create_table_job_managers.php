<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableJobManagers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_managers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_id');
            $table->unsignedInteger('user_id');
            $table->string('email', 60);
            $table->string('label');
            $table->string('name', 50);
            $table->timestamps();

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
        Schema::dropIfExists('job_managers');
    }
}
