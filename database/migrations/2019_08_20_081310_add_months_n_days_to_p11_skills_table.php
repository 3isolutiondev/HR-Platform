<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMonthsNDaysToP11SkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_skills', function (Blueprint $table) {
            $table->integer('months')->default(0);
            $table->integer('days')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_skills', function (Blueprint $table) {
            $table->dropColumn('months');
            $table->dropColumn('days');
        });
    }
}
