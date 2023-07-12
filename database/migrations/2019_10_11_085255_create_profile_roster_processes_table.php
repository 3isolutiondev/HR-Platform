<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfileRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profile_roster_processes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('roster_process_id')->unsigned()->nullable();
            $table->integer('profile_id')->unsigned()->nullable();
            $table->boolean('set_as_current_process')->default(0);
            $table->timestamps();

            $table->foreign('roster_process_id')->references('id')->on('roster_processes');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profile_roster_processes');
    }
}
