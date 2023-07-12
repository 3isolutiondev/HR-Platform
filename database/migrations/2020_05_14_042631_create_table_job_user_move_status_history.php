<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableJobUserMoveStatusHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_user_move_status_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('job_status_id')->nullable();
            $table->unsignedInteger('user_move_id')->nullable();
            $table->boolean('is_current_status')->default(1);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_user_move_status_history');
    }
}
