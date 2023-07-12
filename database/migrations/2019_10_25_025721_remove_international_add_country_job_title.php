<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveInternationalAddCountryJobTitle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_relatives_employed_by_public_int_org', function (Blueprint $table) {
            $table->dropColumn('international_org_name');
            $table->string('job_title')->nullable()->after('relationship');
            $table->integer('country_id')->unsigned()->nullable()->after('job_title');
            $table->foreign('country_id')->references('id')->on('countries');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_relatives_employed_by_public_int_org', function (Blueprint $table) {
            $table->dropForeign('p11_relatives_employed_by_public_int_org_country_id_foreign');
            $table->string('international_org_name')->after('relationship');
            $table->dropColumn('country_id');
            $table->dropColumn('job_title');
        });
    }
}
