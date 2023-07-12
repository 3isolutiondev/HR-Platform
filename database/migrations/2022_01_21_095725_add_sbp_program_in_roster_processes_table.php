<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSbpProgramInRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_processes', function (Blueprint $table) {
            $table->string('under_sbp_program')->default("no")->comment('This Roster Process is under SBP / Surge Program (value: yes / no), it can only have one yes value on the table');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_processes', function (Blueprint $table) {
            $table->dropColumn('under_sbp_program');
        });
    }
}
