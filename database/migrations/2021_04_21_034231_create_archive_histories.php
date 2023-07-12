<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArchiveHistories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('user_archive_histories')) {
            Schema::create('user_archive_histories', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedInteger('user_id');
                $table->unsignedInteger('user_who_moved_the_user');
                $table->string('state')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('user_who_moved_the_user')->references('id')->on('users')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('user_star_histories')) {
            Schema::create('user_star_histories', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedInteger('user_id');
                $table->unsignedInteger('user_who_moved_the_user');
                $table->string('state')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('user_who_moved_the_user')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_archive_histories');
        Schema::dropIfExists('user_star_histories');
    }
}
