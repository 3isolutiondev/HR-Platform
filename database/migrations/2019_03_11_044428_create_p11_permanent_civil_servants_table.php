<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11PermanentCivilServantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_permanent_civil_servants', function (Blueprint $table) {
            $table->increments('id');
            $table->date('from');
            $table->date('to');
            $table->unsignedInteger('is_now')->default(0);
            $table->string('institution')->nullable();
            $table->unsignedInteger('profile_id');
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
        Schema::dropIfExists('p11_permanent_civil_servants');
    }
}
