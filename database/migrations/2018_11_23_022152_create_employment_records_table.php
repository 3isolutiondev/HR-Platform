<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmploymentRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employment_records', function (Blueprint $table) {
            $table->increments('id');
            $table->string('employer_name');
            $table->string('employer_address');
            $table->date('from');
            $table->date('to');
            $table->integer('starting_salary');
            $table->integer('final_salary');
            $table->string('job_title');
            $table->text('job_description');
            $table->string('business_type');
            $table->string('supervisor_name');
            $table->integer('number_of_employees_supervised');
            $table->text('reason_for_leaving');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employment_records');
    }
}
