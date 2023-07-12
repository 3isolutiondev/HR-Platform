<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11ProfilesSectorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_profiles_sectors', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->unsignedInteger('profile_id');
            $table->unsignedInteger('sector_id');
            $table->unsignedInteger('years')->default(0);
            $table->boolean('has_portfolio')->default(0);
            $table->timestamps();

            $table->foreign('profile_id')->references('id')->on('profiles');
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
        Schema::dropIfExists('p11_profiles_sectors');
    }
}
