<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterP11ProfilesSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_profiles_skills', function (Blueprint $table) {
            $table->integer('years')->default(0);
            $table->boolean('has_portfolio')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_profiles_skills', function (Blueprint $table) {
            $table->dropColumn('years');
            $table->dropColumn('has_portfolio');
        });
    }
}
