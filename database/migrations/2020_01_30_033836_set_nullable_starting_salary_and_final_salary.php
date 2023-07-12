<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetNullableStartingSalaryAndFinalSalary extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_employment_records', function (Blueprint $table) {
            $table->integer('starting_salary')->nullable()->change();
            $table->integer('final_salary')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_employment_records', function (Blueprint $table) {
            $table->integer('starting_salary')->nullable(false)->change();
            $table->integer('final_salary')->nullable(false)->change();
        });
    }
}
