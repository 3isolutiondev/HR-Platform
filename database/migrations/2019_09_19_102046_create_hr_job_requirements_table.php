<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrJobRequirementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_job_requirements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('job_category_id')->unsigned()->nullable();
            $table->string('requirement');
            $table->string('component');
            $table->json('requirement_value');
            $table->timestamps();

            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_job_requirements');
    }
}
