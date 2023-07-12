<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddViewStatusToSecurityModuleRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->string('view_status')->default('unhide')->after('status');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->string('view_status')->default('unhide')->after('status');
        });

        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->string('view_status')->default('unhide')->after('status');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->string('view_status')->default('unhide')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->dropColumn('view_status');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->dropColumn('view_status');
        });

        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->dropColumn('view_status');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->dropColumn('view_status');
        });

    }
}
