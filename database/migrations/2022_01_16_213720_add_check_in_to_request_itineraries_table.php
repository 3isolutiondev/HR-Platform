<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCheckInToRequestItinerariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_request_itineraries', function (Blueprint $table) {
            $table->boolean('check_in')->default(false)->after('outbound_trip_final_destination');
            $table->boolean('check_in_outbound')->default(false)->after('check_in');
            $table->boolean('check_in_return')->default(false)->after('check_in_outbound');

        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->boolean('check_in')->default(false)->after('outbound_trip_final_destination');
            $table->boolean('check_in_outbound')->default(false)->after('check_in');
            $table->boolean('check_in_return')->default(false)->after('check_in_outbound');
        });

        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->boolean('check_in')->default(false)->after('outbound_trip_final_destination');
            $table->boolean('check_in_outbound')->default(false)->after('check_in');
            $table->boolean('check_in_return')->default(false)->after('check_in_outbound');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->boolean('check_in')->default(false)->after('outbound_trip_final_destination');
            $table->boolean('check_in_outbound')->default(false)->after('check_in');
            $table->boolean('check_in_return')->default(false)->after('check_in_outbound');
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
            $table->dropColumn('check_in');
            $table->dropColumn('check_in_outbound');
            $table->dropColumn('check_in_return');

        });

        Schema::table('security_module_mrf_request_itineraries_revisions', function (Blueprint $table) {
            $table->dropColumn('check_in');
            $table->dropColumn('check_in_outbound');
            $table->dropColumn('check_in_return');
        });

        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->dropColumn('check_in');
            $table->dropColumn('check_in_outbound');
            $table->dropColumn('check_in_return');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->dropColumn('check_in');
            $table->dropColumn('check_in_outbound');
            $table->dropColumn('check_in_return');
        });
    }
}
