<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddKindOfEmployeesSupervised extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_employment_records', function (Blueprint $table) {
            $table->unsignedInteger('number_of_employees_supervised')->nullable()->change();
            $table->text('kind_of_employees_supervised')->nullable()->after('number_of_employees_supervised');
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
            $table->dropColumn('kind_of_employees_supervised');
        });
    }
}
