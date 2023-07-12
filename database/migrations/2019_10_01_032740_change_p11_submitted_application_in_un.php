<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeP11SubmittedApplicationInUn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->dropForeign('p11_submitted_application_in_un_un_organization_id_foreign');
            $table->dropColumn('un_organization_id');
            $table->string('project');
            $table->integer('country_id')->unsigned()->nullable();
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
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->dropForeign('p11_submitted_application_in_un_country_id_foreign');
            $table->dropColumn('country_id');
            $table->dropColumn('project');
            $table->integer('un_organization_id')->unsigned()->nullable();
            $table->foreign('un_organization_id')->references('id')->on('un_organizations');
        });
    }
}
