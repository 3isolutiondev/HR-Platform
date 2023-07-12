<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropOfficeEquipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('p11_office_equipments');
        Schema::dropIfExists('office_equipments');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('office_equipments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('p11_office_equipments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('office_equipment_id');
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('office_equipment_id')->references('id')->on('office_equipments');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }
}
