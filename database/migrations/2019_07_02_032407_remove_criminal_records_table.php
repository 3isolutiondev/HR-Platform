<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveCriminalRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('p11_criminal_records');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('p11_criminal_records', function (Blueprint $table) {
            $table->increments('id');
            $table->date('criminal_date');
            $table->text('details');
            $table->unsignedInteger('country_id');
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }
}
