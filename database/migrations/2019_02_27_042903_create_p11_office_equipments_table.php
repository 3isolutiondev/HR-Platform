<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11OfficeEquipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_office_equipments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('office_equipment_id');
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('office_equipment_id')->references('id')->on('office_equipments');
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
        Schema::dropIfExists('p11_office_equipments');
    }
}
