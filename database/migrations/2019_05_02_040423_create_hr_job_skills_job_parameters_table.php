<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrJobSkillsJobParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_job_skills_job_parameters', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('job_skill_id');
            $table->unsignedInteger('job_parameter_id');
            $table->enum('field_type',['text','select','autocomplete']);
            $table->timestamps();

            $table->foreign('job_skill_id')->references('id')->on('hr_job_skills');
            $table->foreign('job_parameter_id')->references('id')->on('hr_job_parameters');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_job_skills_job_parameters');
    }
}
