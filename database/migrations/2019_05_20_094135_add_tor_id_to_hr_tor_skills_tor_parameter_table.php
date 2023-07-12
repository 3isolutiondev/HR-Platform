<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTorIdToHrTorSkillsTorParameterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor_skills_tor_parameters', function (Blueprint $table) {
            $table->bigInteger('tor_id')->unsigned()->after('job_parameter_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor_skills_tor_parameters', function (Blueprint $table) {
            $table->dropColumn('tor_id');
        });
    }
}
