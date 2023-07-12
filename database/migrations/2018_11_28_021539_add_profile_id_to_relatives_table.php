<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProfileIdToRelativesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('relatives_employed_by_public_int_org', function (Blueprint $table) {
            $table->unsignedInteger('profile_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('relatives_employed_by_public_int_org', function (Blueprint $table) {
            $table->dropColumn('profile_id');
        });
    }
}
