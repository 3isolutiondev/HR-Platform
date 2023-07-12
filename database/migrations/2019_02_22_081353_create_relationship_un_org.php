<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelationshipUnOrg extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->foreign('un_organization_id')->references('id')->on('un_organizations');
            $table->foreign('profile_id')->references('id')->on('profiles');
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
            $table->dropForeign(['un_organizations_id', 'profile_id']);
        });
    }
}
