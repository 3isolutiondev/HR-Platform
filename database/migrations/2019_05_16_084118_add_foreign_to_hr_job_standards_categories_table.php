<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignToHrJobStandardsCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('hr_job_standards_job_categories');

        Schema::create('hr_job_standards_job_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('job_standard_id');
            $table->unsignedInteger('job_category_id');
            $table->timestamps();

            $table->foreign('job_standard_id')->references('id')->on('hr_job_standards');
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
        Schema::dropIfExists('hr_job_standards_job_categories');

         Schema::create('hr_job_standards_job_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('job_standard_id');
            $table->unsignedInteger('job_category_id');
            $table->timestamps();
        });
    }
}
