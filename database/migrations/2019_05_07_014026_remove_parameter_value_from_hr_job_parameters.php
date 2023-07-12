<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class RemoveParameterValueFromHrJobParameters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_job_parameters', function (Blueprint $table) {
            // $table->enum('parameter_type', ['number', 'text', 'min', 'max', 'range', 'language'])->change();
            $table->dropColumn('parameter_value');
        });
        DB::statement("ALTER TABLE hr_job_parameters CHANGE COLUMN parameter_type parameter_type ENUM('number', 'text', 'min', 'max', 'range', 'language') NOT NULL");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_job_parameters', function (Blueprint $table) {
            $table->text('parameter_value');
            // $table->enum('parameter_type', ['number', 'text', 'min', 'max', 'range'])->change();
            DB::statement("ALTER TABLE hr_job_parameters CHANGE COLUMN parameter_type parameter_type ENUM('number', 'text', 'min', 'max', 'range') NOT NULL");
        });
    }
}
