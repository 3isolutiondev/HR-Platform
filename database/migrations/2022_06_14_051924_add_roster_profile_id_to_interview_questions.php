<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRosterProfileIdToInterviewQuestions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->unsignedBigInteger('roster_profile_id')->nullable();
            $table->foreign('roster_profile_id')->references('id')->on('profile_roster_processes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->dropForeign('roster_profile_id');
            $table->dropColumn('roster_profile_id');
        });
    }
}
