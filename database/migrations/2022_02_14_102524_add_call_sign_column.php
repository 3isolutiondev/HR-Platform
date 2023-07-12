<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCallSignColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_request_travel_details', function (Blueprint $table) {
            $table->string('comm_vhf_radio_call_sign')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_mrf_request_travel_details', function (Blueprint $table) {
            $table->dropColumn('comm_vhf_radio_call_sign');
        });
    }
}
