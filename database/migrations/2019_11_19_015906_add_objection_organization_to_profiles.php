<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddObjectionOrganizationToProfiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('objection_telephone');
            $table->string('objection_position')->nullable()->after('objection_email');
            $table->string('objection_organization')->nullable()->after('objection_position');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('objection_organization');
            $table->dropColumn('objection_position');
            $table->string('objection_telephone')->nullable()->after('objection_email');
        });
    }
}
