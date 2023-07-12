<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddComingFromJobIdToProfileRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->unsignedInteger('coming_from_job_id')->nullable();
            $table->foreign('coming_from_job_id')->references('id')->on('jobs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->dropForeign(['coming_from_job_id']);
            $table->dropColumn('coming_from_job_id');
        });
    }
}
