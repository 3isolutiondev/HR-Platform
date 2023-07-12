<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEditOnApprovalSecurityModuleRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->boolean('edit_on_approval')->default(false)->after('view_status');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->boolean('edit_on_approval')->default(false)->after('view_status');
        });

        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->boolean('edit_on_approval')->default(false)->after('view_status');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->boolean('edit_on_approval')->default(false)->after('view_status');
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
            $table->dropColumn('edit_on_approval');
        });

        Schema::table('security_module_tar_request_revision', function (Blueprint $table) {
            $table->dropColumn('edit_on_approval');
        });

        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->dropColumn('edit_on_approval');
        });

        Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
            $table->dropColumn('edit_on_approval');
        });

    }
}
