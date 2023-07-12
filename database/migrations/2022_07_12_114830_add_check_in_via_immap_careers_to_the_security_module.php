<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCheckInViaImmapCareersToTheSecurityModule extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //TAR Request
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->boolean('security_measure_immap_careers')->default(false)->after('security_measure_smart24');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->boolean('security_measure_immap_careers')->default(false)->after('security_measure_smart24');
        });

        //MRF Request
        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->boolean('security_measure_immap_careers')->default(false)->after('security_measure_smart24');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->boolean('security_measure_immap_careers')->default(false)->after('security_measure_smart24');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //TAR Request
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->dropColumn('security_measure_immap_careers');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->dropColumn('security_measure_immap_careers');
        });

        //MRF Request
        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->dropColumn('security_measure_immap_careers');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->dropColumn('security_measure_immap_careers');
        });

    }
}
