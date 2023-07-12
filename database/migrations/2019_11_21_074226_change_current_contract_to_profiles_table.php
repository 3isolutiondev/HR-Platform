<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCurrentContractToProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('date_of_current_contract');
            $table->date('start_of_current_contract')->nullable();
            $table->date('end_of_current_contract')->nullable();
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
            $table->dropColumn('start_of_current_contract');
            $table->dropColumn('end_of_current_contract');
            $table->date('date_of_current_contract')->nullable();
        });
    }
}
