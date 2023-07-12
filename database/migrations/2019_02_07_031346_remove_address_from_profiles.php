<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveAddressFromProfiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('permanent_address');
            $table->dropColumn('permanent_address_phone');
            $table->dropColumn('present_address');
            $table->dropColumn('present_address_phone');
            $table->dropColumn('office_telephone');
            $table->dropColumn('office_fax');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->text('permanent_address')->nullable();
            $table->string('permanent_address_phone')->nullable();
            $table->text('present_address')->nullable();
            $table->string('present_address_phone')->nullable();
            $table->string('office_telephone')->nullable();
            $table->string('office_fax')->nullable();
        });
    }
}
