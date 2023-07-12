<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrTorSkillsTorParameters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_tor_skills_tor_parameters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_skill_id');
            $table->unsignedInteger('job_parameter_id');
            $table->enum('field_type',['text','select','autocomplete']);
            $table->timestamps();

            $table->foreign('job_skill_id')->references('id')->on('hr_tor_skills');
            $table->foreign('job_parameter_id')->references('id')->on('hr_tor_parameters');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_tor_skills_tor_parameters');
    }
}
