<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11EmploymentRecordsSectorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_employment_records_sectors', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('p11_employment_id');
            $table->unsignedInteger('sector_id');
            $table->timestamps();

            $table->foreign('p11_employment_id')->references('id')->on('p11_employment_records');
            $table->foreign('sector_id')->references('id')->on('sectors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_employment_records_sectors');
    }
}
