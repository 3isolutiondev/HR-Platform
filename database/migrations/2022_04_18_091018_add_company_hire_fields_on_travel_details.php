<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCompanyHireFieldsOnTravelDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_mrf_request_travel_details', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('personnel_on_board');
            $table->string('company_email')->nullable()->after('company_name');
            $table->string('company_phone_number')->nullable()->after('company_email');
            $table->string('company_driver')->nullable()->after('company_phone_number');
        });

        Schema::table('security_module_mrf_request_travel_details_revisions', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('personnel_on_board');
            $table->string('company_email')->nullable()->after('company_name');
            $table->string('company_phone_number')->nullable()->after('company_email');
            $table->string('company_driver')->nullable()->after('company_phone_number');
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
            $table->dropColumn('company_name');
            $table->dropColumn('company_email');
            $table->dropColumn('company_phone_number');
            $table->dropColumn('company_driver');
        });

        Schema::table('security_module_mrf_request_travel_details_revisions', function (Blueprint $table) {
            $table->dropColumn('company_name');
            $table->dropColumn('company_email');
            $table->dropColumn('company_phone_number');
            $table->dropColumn('company_driver');
        });
    }
}
