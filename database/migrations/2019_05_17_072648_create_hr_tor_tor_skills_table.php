<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrTorTorSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_tor_tor_skills', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('tor_id')->unsigned();
            $table->unsignedInteger('job_skill_id');
            $table->timestamps();

            $table->foreign('tor_id')->references('id')->on('hr_tor');
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
        Schema::dropIfExists('hr_tor_tor_skills');
    }
}
