<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsArchivedOnTravelRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_tar_request', function (Blueprint $table) {
            $table->boolean('is_archived')->default(false);
        });
        
        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->boolean('is_archived')->default(false);
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
            $table->dropColumn('is_archived');
        });

        Schema::table('security_module_mrf_requests', function (Blueprint $table) {
            $table->dropColumn('is_archived');
        });
    }
}
