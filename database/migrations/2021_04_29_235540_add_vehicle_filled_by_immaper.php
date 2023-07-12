<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVehicleFilledByImmaper extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('countries')) {
            if (!Schema::hasColumn('countries', 'vehicle_filled_by_immaper')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->string('vehicle_filled_by_immaper')->default('yes')->comment('Vehicle Details on Domestic Road Travel will be filled by iMMAPer (value: yes / no)');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('countries')) {
            if (Schema::hasColumn('countries', 'vehicle_filled_by_immaper')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->dropColumn('vehicle_filled_by_immaper');
                });
            }
        }
    }
}
