<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCurrentStepToProfileRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->integer('current_step')->default(0)->after('set_as_current_process');
            $table->boolean('is_completed')->default(0)->after('current_step');
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
            $table->dropColumn('current_step');
            $table->dropColumn('is_completed');
        });
    }
}
