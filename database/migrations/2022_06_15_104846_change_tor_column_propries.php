<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTorColumnPropries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->text('duty_station')->nullable()->change();
            $table->unsignedInteger('country_id')->nullable()->change();
            $table->date('contract_start')->nullable()->change();
            $table->date('contract_end')->nullable()->change();
            $table->text('organization')->nullable()->change();
            $table->integer('min_salary')->nullable()->change();
            $table->integer('max_salary')->nullable()->change();  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->text('duty_station')->nullable(false)->change();
            $table->unsignedInteger('country_id')->nullable(false)->change();
            $table->date('contract_start')->nullable(false)->change();
            $table->date('contract_end')->nullable(false)->change();
            $table->text('organization')->nullable(false)->change();
            $table->integer('min_salary')->nullable(false)->change();
            $table->integer('max_salary')->nullable(false)->change();  
        });
    }
}
