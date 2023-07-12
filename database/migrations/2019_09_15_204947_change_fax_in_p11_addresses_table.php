<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeFaxInP11AddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->dropColumn('fax');
        });
        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->string('fax')->nullable();
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
            $table->dropColumn('fax');
        });
        Schema::table('p11_addresses', function (Blueprint $table) {
            $table->string('fax');
        });
    }
}
