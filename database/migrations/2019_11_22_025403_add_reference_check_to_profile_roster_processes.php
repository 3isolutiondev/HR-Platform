<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddReferenceCheckToProfileRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->unsignedBigInteger('reference_check_id')->nullable()->after('interview_invitation_done');
            $table->boolean('is_rejected')->default(0)->after('is_completed');
            // $table->foreign('reference_check_id')
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
            $table->dropColumn('reference_check_id');
            $table->dropColumn('is_rejected');
        });
    }
}
