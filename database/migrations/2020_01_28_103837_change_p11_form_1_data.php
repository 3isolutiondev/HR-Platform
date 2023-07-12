<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeP11Form1Data extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            // $table->dropColumn('marital_status');
            // $table->dropColumn('place_of_birth');
            // $table->dropColumn('birth_date');
            // $table->dropColumn('bdate');
            // $table->dropColumn('bmonth');
            // $table->dropColumn('byear');
            // $table->dropColumn('has_disabilities');
            // $table->dropColumn('disabilities');
            $table->unsignedInteger('country_residence_id')->nullable()->after('user_id');

            $table->foreign('country_residence_id')->references('id')->on('countries');
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
            $table->dropForeign('profiles_country_residence_id_foreign');
            $table->dropColumn('country_residence_id');
        });
    }
}
