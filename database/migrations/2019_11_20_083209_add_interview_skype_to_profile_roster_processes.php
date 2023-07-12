<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInterviewSkypeToProfileRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->string('interview_skype')->nullable()->after('im_test_invitation_done');
            $table->timestamp('interview_date')->nullable()->after('interview_skype');
            $table->string('interview_timezone')->nullable()->after('interview_date');
            $table->boolean('interview_invitation_done')->default(0)->after('interview_timezone');
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
            $table->dropColumn('interview_skype');
            $table->dropColumn('interview_date');
            $table->dropColumn('interview_timezone');
            $table->dropColumn('interview_invitation_done');
        });
    }
}
