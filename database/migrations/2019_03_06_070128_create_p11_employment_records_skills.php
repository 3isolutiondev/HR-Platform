<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11EmploymentRecordsSkills extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_employment_records_skills', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('p11_employment_record_id');
            $table->unsignedInteger('skill_id');
            $table->timestamps();

            $table->foreign('p11_employment_record_id')->references('id')->on('p11_employment_records');
            $table->foreign('skill_id')->references('id')->on('skills');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_employment_records_skills');
    }
}
