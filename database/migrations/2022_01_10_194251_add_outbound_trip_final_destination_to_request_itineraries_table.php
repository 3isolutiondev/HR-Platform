<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOutboundTripFinalDestinationToRequestItinerariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
            $table->boolean('outbound_trip_final_destination')->default(false)->after('overnight_explanation');
        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->boolean('outbound_trip_final_destination')->default(false)->after('overnight_explanation');
        });

        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->boolean('outbound_trip_final_destination')->default(false)->after('is_high_risk');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->boolean('outbound_trip_final_destination')->default(false)->after('is_high_risk');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
            $table->dropColumn('outbound_trip_final_destination');
        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->dropColumn('outbound_trip_final_destination');
        });

        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->dropColumn('outbound_trip_final_destination');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->dropColumn('outbound_trip_final_destination');
        });
    }
}
