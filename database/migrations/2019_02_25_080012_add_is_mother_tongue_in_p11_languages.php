<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsMotherTongueInP11Languages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_languages', function (Blueprint $table) {
            $table->boolean('is_mother_tongue')->default(0);
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
        Schema::table('p11_languages', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn('is_mother_tongue');
        });
    }
}
