<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableJobManagerComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_manager_comments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->text('comments')->nullable();
            $table->unsignedInteger('comment_by_id')->nullable();
            $table->unsignedBigInteger('root');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('job_manager_comments');
    }
}
