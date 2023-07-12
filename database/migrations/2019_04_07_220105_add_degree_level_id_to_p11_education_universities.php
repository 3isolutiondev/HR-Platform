<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDegreeLevelIdToP11EducationUniversities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_education_universities', function (Blueprint $table) {
            $table->unsignedInteger('degree_level_id')->nullable();

            $table->foreign('degree_level_id')->references('id')->on('degree_levels');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_education_universities', function (Blueprint $table) {
            $table->dropForeign('p11_education_universities_degree_level_id_foreign');
            $table->dropColumn('degree_level_id');
        });
    }
}
