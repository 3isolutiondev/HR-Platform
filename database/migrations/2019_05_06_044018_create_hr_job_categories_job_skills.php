<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrJobCategoriesJobSkills extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_job_categories_job_skills', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('job_category_id');
            $table->unsignedInteger('job_skill_id');
            $table->text('skill');
            $table->timestamps();

            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
            $table->foreign('job_skill_id')->references('id')->on('hr_job_skills');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_job_categories_job_skills');
    }
}
