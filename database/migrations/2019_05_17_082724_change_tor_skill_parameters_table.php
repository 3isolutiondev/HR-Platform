<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTorSkillParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor_skills_tor_parameters', function (Blueprint $table) {
            $table->text('parameter_value')->after('field_type');
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
            $table->dropColumn('parameter_value');
        });
    }
}
