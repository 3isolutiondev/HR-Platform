<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddClusterToHrTor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->string('cluster')->nullable();
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->string('surge_alert_sent')->default('no')->comment('Surge Alert Has Been Sent or Not (value: yes / no)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropColumn('cluster');
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn('surge_alert_sent');
        });
    }
}
