<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11AddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_addresses', function (Blueprint $table) {
            $table->increments('id');
            $table->text('address');
            $table->string('city');
            $table->string('postcode');
            $table->string('telephone');
            $table->string('fax');
            $table->unsignedInteger('country_id');
            $table->enum('type', ['permanent','present','both']);
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
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
        Schema::dropIfExists('p11_addresses');
    }
}
