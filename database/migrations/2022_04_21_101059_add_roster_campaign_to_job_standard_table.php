<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRosterCampaignToJobStandardTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_job_standards', function (Blueprint $table) {
            $table->string("sbp_recruitment_campaign")->default("no")->comment('job standard for sbp recruitment campaign: yes/no');;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_job_standards', function (Blueprint $table) {
            $table->dropColumn("sbp_recruitment_campaign");
        });
    }
}
