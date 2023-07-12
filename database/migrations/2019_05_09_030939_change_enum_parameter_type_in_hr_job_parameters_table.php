<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeEnumParameterTypeInHrJobParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_job_parameters', function (Blueprint $table) {
            DB::statement("ALTER TABLE hr_job_parameters CHANGE COLUMN parameter_type parameter_type ENUM('number', 'text', 'min', 'max', 'range', 'language', 'degree-level') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_job_parameters', function (Blueprint $table) {
            DB::statement("ALTER TABLE hr_job_parameters CHANGE COLUMN parameter_type parameter_type ENUM('number', 'text', 'min', 'max', 'range', 'language') NOT NULL");
        });
    }
}
