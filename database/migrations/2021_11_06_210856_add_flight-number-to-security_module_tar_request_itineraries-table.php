<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFlightNumberToSecurityModuleTarRequestItinerariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->string('flight_number')->nullable()->after('to_city');
            $table->string('flight_number_outbound_trip')->nullable()->after('flight_number');
            $table->string('flight_number_return_trip')->nullable()->after('flight_number_outbound_trip');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->string('flight_number')->nullable()->after('to_city');
            $table->string('flight_number_outbound_trip')->nullable()->after('flight_number');
            $table->string('flight_number_return_trip')->nullable()->after('flight_number_outbound_trip');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->dropColumn('flight_number');
            $table->dropColumn('flight_number_outbound_trip');
            $table->dropColumn('flight_number_return_trip');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->dropColumn('flight_number');
            $table->dropColumn('flight_number_outbound_trip');
            $table->dropColumn('flight_number_return_trip');
        });
    }
}
