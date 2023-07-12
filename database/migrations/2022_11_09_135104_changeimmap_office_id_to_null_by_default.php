<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeimmapOfficeIdToNullByDefault extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_contract_histories', function (Blueprint $table) {
            $table->unsignedBigInteger('immap_office_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_contract_histories', function (Blueprint $table) {
            $table->unsignedBigInteger('immap_office_id')->nullable(false)->change();
        });
    }
}
