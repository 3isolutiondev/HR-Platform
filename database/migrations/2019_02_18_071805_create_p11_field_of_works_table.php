<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11FieldOfWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_field_of_works', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('field_of_work_id');
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('field_of_work_id')->references('id')->on('field_of_works');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_field_of_works');
    }
}
