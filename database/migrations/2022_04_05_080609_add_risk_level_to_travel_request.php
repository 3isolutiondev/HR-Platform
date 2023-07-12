<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRiskLevelToTravelRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->string('risk_level')->nullable()->after('edit_on_approval');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->string('risk_level')->nullable()->after('edit_on_approval');
        });

        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->string('risk_level')->nullable()->after('edit_on_approval');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->string('risk_level')->nullable()->after('edit_on_approval');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->dropColumn('risk_level');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->dropColumn('risk_level');
        });

        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->dropColumn('risk_level');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->dropColumn('risk_level');
        });
    }
}
