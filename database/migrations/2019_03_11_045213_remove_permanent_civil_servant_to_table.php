<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemovePermanentCivilServantToTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('permanent_civil_servant_from');
            $table->dropColumn('permanent_civil_servant_to');
            $table->dropColumn('permanent_civil_servant_is_now');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->date('permanent_civil_servant_from');
            $table->date('permanent_civil_servant_to');
            $table->boolean('permanent_civil_servant_is_now')->default(0);
        });
    }
}
