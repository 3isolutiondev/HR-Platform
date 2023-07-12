<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateTorDesignTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        Schema::dropIfExists('hr_tor_tor_skills_tor_parameters');
        Schema::dropIfExists('hr_tor_tor_skills_parameters');

        Schema::dropIfExists('hr_tor_tor_skills');
        
        // Schema::dropIfExists('hr_tor_parameters');
        // Schema::dropIfExists('hr_tor_skills');
        // DB::statement('SET FOREIGN_KEY_CHECKS = 1');

        Schema::table('hr_tor_skills', function (Blueprint $table) {
            // $table->bigIncrements('id');
            $table->bigInteger('tor_id')->unsigned();
            $table->Integer('job_skill_id')->unsigned();
            $table->text('skill');
            // $table->timestamps();

            $table->foreign('tor_id')->references('id')->on('hr_tor');
            $table->foreign('job_skill_id')->references('id')->on('hr_job_skills');
        });

        Schema::table('hr_tor_parameters', function (Blueprint $table) {
            // $table->bigIncrements('id');
            $table->integer('hr_tor_skill_id')->unsigned();
            $table->unsignedInteger('job_skill_id');
            $table->unsignedInteger('job_parameter_id');
            $table->enum('field_type',['text','select','autocomplete']);
            $table->text('parameter_value');
            // $table->timestamps();

            $table->foreign('job_skill_id')->references('id')->on('hr_job_skills');
            $table->foreign('hr_tor_skill_id')->references('id')->on('hr_tor_skills');
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
        // Schema::dropIfExists('hr_tor_skills');
        // Schema::dropIfExists('hr_tor_parameters');

        // Schema::create('hr_tor_skills', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->string('name');
        //     $table->string('slug')->unique();
        //     $table->enum('type',['model','text','number']);
        //     $table->string('selected_model')->nullable();
        //     $table->timestamps();
        // });

        // Schema::create('hr_tor_parameters', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->string('name');
        //     $table->string('slug')->unique();
        //     $table->enum('parameter_type',['number','text','min','max','range','language','degree-level']);
        //     $table->text('parameter_value');
        //     $table->timestamps();
        // });

        // Schema::create('hr_tor_tor_skills', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->bigInteger('tor_id')->unsigned();
        //     $table->unsignedInteger('job_skill_id');
        //     $table->text('skill');
        //     $table->timestamps();

        //     $table->foreign('tor_id')->references('id')->on('hr_tor');
        //     $table->foreign('job_skill_id')->references('id')->on('hr_tor_skills');
        // });

        // Schema::create('hr_tor_skills_tor_parameters', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->unsignedInteger('job_skill_id');
        //     $table->unsignedInteger('job_parameter_id');
        //     $table->bigInteger('tor_id')->unsigned();
        //     $table->enum('field_type',['text','select','autocomplete']);
        //     $table->text('parameter_value');
        //     $table->timestamps();

        //     $table->foreign('tor_id')->references('id')->on('hr_tor');
        //     $table->foreign('job_skill_id')->references('id')->on('hr_tor_skills');
        //     $table->foreign('job_parameter_id')->references('id')->on('hr_tor_parameters');
        // });

        // Schema::create('hr_tor_tor_skills_tor_parameters', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->bigInteger('hr_tor_tor_skill_id')->unsigned();
        //     $table->unsignedInteger('job_parameter_id');
        //     $table->enum('field_type',['text','select','autocomplete']);
        //     $table->text('parameter_value');
        //     $table->timestamps();

        //     $table->foreign('hr_tor_tor_skill_id')->references('id')->on('hr_tor_tor_skills');
        //     $table->foreign('job_parameter_id')->references('id')->on('hr_tor_parameters');
        // });
    }
}
