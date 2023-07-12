<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrJobCategoriesSections extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_job_categories_sections', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->integer('hr_job_category_id')->unsigned();
            $table->string('sub_section');
            $table->text('sub_section_content');
            $table->integer('level');
            $table->timestamps();

            $table->foreign('hr_job_category_id')->references('id')->on('hr_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_job_categories_sections');
    }
}
