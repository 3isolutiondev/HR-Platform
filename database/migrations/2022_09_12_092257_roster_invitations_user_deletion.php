<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RosterInvitationsUserDeletion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_invitations', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_invitations', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }
}
