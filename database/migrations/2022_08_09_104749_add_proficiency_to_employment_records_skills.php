<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProficiencyToEmploymentRecordsSkills extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_employment_records_skills', function (Blueprint $table) {
            $table->integer('proficiency')->default(0)->after('skill_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_employment_records_skills', function (Blueprint $table) {
            $table->dropColumn('proficiency');
        });
    }
}
