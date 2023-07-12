<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddJobStandardToHrTorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('hr_tor');

        Schema::create('hr_tor', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('duty_station');
            $table->unsignedInteger('country_id');
            $table->date('contract_start');
            $table->date('contract_end');
            $table->text('relationship');
            $table->text('organization');
            $table->text('background');
            $table->text('description_of_duties');
            $table->text('requirements');
            $table->unsignedInteger('job_standard_id');
            $table->unsignedInteger('job_category_id');
            $table->unsignedInteger('job_level_id');
            $table->timestamps();


            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('job_standard_id')->references('id')->on('hr_job_standards');
            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
            $table->foreign('job_level_id')->references('id')->on('hr_job_levels');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_tor');

        Schema::create('hr_tor', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('duty_station');
            $table->unsignedInteger('country_id');
            $table->date('contract_start');
            $table->date('contract_end');
            $table->text('organization');
            $table->text('background');
            $table->text('description_of_duties');
            $table->text('requirements');
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
        });
    }
}
