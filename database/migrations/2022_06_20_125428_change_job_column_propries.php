<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeJobColumnPropries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->unsignedInteger('country_id')->nullable()->change();
            $table->date('contract_start')->nullable()->change();
            $table->date('contract_end')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->unsignedInteger('country_id')->nullable(false)->change();
            $table->date('contract_start')->nullable(false)->change();
            $table->date('contract_end')->nullable(false)->change();
         });
    }
}
