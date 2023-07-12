<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImTestStartTimeToProfileRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->timestamp('im_test_start_time')->nullable()->after('im_test_invitation_done');
            $table->timestamp('im_test_end_time')->nullable()->after('im_test_start_time');
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
            $table->dropColumn('im_test_start_time');
            $table->dropColumn('im_test_end_time');
        });
    }
}
