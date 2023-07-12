<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCvToCvIdInProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->unsignedInteger('cv_id')->nullable();
            $table->unsignedInteger('id_card_id')->nullable();
            $table->unsignedInteger('passport_id')->nullable();
            $table->unsignedInteger('signature_id')->nullable();

            $table->dropColumn('cv');
            $table->dropColumn('id_card');
            $table->dropColumn('passport');
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
            $table->unsignedInteger('cv');
            $table->unsignedInteger('id_card');
            $table->unsignedInteger('passport');

            $table->dropColumn('cv_id');
            $table->dropColumn('id_card_id');
            $table->dropColumn('passport_id');
            $table->dropColumn('signature_id');

        });
    }
}
