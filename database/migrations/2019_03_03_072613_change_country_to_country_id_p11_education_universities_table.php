<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCountryToCountryIdP11EducationUniversitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_education_universities', function (Blueprint $table) {
            $table->dropColumn('country');
            $table->unsignedInteger('country_id');

            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('profile_id')->references('id')->on('profiles');
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
            $table->dropForeign(['country_id','profile_id']);
            $table->dropColumn('country_id');
            $table->string('country');
        });
    }
}
