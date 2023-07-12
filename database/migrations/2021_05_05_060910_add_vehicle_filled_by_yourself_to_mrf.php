<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVehicleFilledByYourselfToMrf extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('security_module_mrf_requests')) {
            if (!Schema::hasColumn('security_module_mrf_requests', 'vehicle_filled_by_yourself')) {
                Schema::table('security_module_mrf_requests', function (Blueprint $table) {
                    $table->string('vehicle_filled_by_yourself')->default('yes')
                        ->comment('Add possibility to fill vehicle details by yourself [yes/no] (only for certain country that the security officer will filled their data, ex: syria)');
                });
            }
        }

        if (Schema::hasTable('security_module_mrf_requests_revisions')) {
            if (!Schema::hasColumn('security_module_mrf_requests_revisions', 'vehicle_filled_by_yourself')) {
                Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
                    $table->string('vehicle_filled_by_yourself')->default('yes')
                        ->comment('Add possibility to fill vehicle details by yourself [yes/no] (only for certain country that the security officer will filled their data, ex: syria)');
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
        if (Schema::hasTable('security_module_mrf_requests')) {
            if (Schema::hasColumn('security_module_mrf_requests', 'vehicle_filled_by_yourself')) {
                Schema::table('security_module_mrf_requests', function (Blueprint $table) {
                    $table->dropColumn('vehicle_filled_by_yourself');
                });
            }
        }
        if (Schema::hasTable('security_module_mrf_requests_revisions')) {
            if (Schema::hasColumn('security_module_mrf_requests_revisions', 'vehicle_filled_by_yourself')) {
                Schema::table('security_module_mrf_requests_revisions', function (Blueprint $table) {
                    $table->dropColumn('vehicle_filled_by_yourself');
                });
            }
        }
    }
}
