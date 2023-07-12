<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11PhonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_phones', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('phone');
            $table->boolean('is_primary');
            $table->integer('profile_id')->unsigned();
            $table->timestamps();

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
        Schema::dropIfExists('p11_phones');
    }
}
