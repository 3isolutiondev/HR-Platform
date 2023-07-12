<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRosterToGlobalComment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('interview_score_comments', function (Blueprint $table) {
            if(!Schema::hasColumn('interview_score_comments', 'roster_profile_id')) {
                $table->unsignedBigInteger('roster_profile_id')->nullable();
                $table->foreign('roster_profile_id')->references('id')->on('profile_roster_processes')->onDelete('cascade');
            }
            $table->unsignedInteger('applicant_id')->nullable()->change();
            $table->unsignedBigInteger('manager_id')->nullable()->change();

            if(!Schema::hasColumn('interview_score_comments', 'roster_process_id')) {
                $table->unsignedBigInteger('roster_process_id')->nullable();
                $table->foreign('roster_process_id')->references('id')->on('roster_processes')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('interview_score_comments', function (Blueprint $table) {
            $table->dropForeign('roster_profile_id');
            $table->dropColumn('roster_profile_id');
            $table->dropForeign('roster_process_id');
            $table->dropColumn('roster_process_id');
        });
    }
}
