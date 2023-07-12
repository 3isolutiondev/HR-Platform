<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMonthsDaysInP11SectorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_sectors', function (Blueprint $table) {
            $table->integer('months')->default(0)->after('years');
            $table->integer('days')->default(0)->after('months');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_sectors', function (Blueprint $table) {
            $table->dropColumn('days');
            $table->dropColumn('months');
        });
    }
}
