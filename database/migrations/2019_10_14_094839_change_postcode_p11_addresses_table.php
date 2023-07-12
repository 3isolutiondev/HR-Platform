<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangePostcodeP11AddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->dropColumn('postcode');
        });

        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->string('postcode')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->dropColumn('postcode');
        });

        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->string('postcode');
        });
    }
}
