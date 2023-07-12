<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveAddressOccupationAddOrganizationJobPositionTableP11References extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_references', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('occupation');
            $table->string('organization')->after('email');
            $table->string('job_position')->after('organization');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_references', function (Blueprint $table) {
            $table->dropColumn('organization');
            $table->dropColumn('job_position');
            $table->text('address')->after('full_name');
            $table->string('occupation')->after('email');
        });
    }
}
