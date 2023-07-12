<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrTorSkillsJobCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_tor_skills_job_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_category_id');
            $table->unsignedInteger('job_skill_id');
            $table->text('skill');
            $table->timestamps();

            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
            $table->foreign('job_skill_id')->references('id')->on('hr_tor_skills');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_tor_skills_job_categories');
    }
}
