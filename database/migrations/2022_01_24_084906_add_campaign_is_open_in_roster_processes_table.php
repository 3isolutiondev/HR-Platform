<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCampaignIsOpenInRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_processes', function (Blueprint $table) {
            $table->string('campaign_is_open')->default('no')->comment('Open / Close Roster Campaign (value: yes / no)');
            $table->string('campaign_open_at_quarter')->nullable();
            $table->string('campaign_open_at_year')->nullable();
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
            $table->dropColumn('campaign_is_open');
            $table->dropColumn('campaign_open_at_quarter');
            $table->dropColumn('campaign_open_at_year');
        });
    }
}
