<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHrTorSections extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hr_tor_sections', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->bigInteger('hr_tor_id')->unsigned();
            $table->string('sub_section');
            $table->text('sub_section_content');
            $table->integer('level');
            $table->timestamps();

            $table->foreign('hr_tor_id')->references('id')->on('hr_tor');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hr_tor_sections');
    }
}
