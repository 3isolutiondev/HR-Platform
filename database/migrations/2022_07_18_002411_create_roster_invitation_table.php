<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRosterInvitationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roster_invitations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('roster_process_id');
            $table->unsignedInteger('profile_id');
            $table->unsignedInteger('invited_by_profile_id');
            $table->boolean('active')->default(true);

            $table->foreign('roster_process_id')->references('id')->on('roster_processes');
            $table->foreign('profile_id')->references('id')->on('profiles');
            $table->foreign('invited_by_profile_id')->references('id')->on('profiles');
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
        Schema::dropIfExists('roster_invitations');
    }
}
