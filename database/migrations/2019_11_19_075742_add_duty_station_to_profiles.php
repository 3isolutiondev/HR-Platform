<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDutyStationToProfiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('job_title')->nullable();
            $table->string('duty_station')->nullable();
            $table->string('line_manager')->nullable();
            $table->date('date_of_current_contract')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('job_title');
            $table->dropColumn('duty_station');
            $table->dropColumn('line_manager');
            $table->dropColumn('date_of_current_contract');
        });
    }
}
