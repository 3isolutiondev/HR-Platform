<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrTorRequirementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_tor_requirements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('tor_id')->unsigned()->nullable();
            $table->string('requirement');
            $table->string('component');
            $table->json('requirement_value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_tor_requirements');
    }
}
