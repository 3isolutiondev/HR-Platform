<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableRepositoryCategoryAddColumnType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('repository_category', function (Blueprint $table) {
            //$table->string('type', 1)->nullable()->comment='1. National Policy, 2. Global Policy';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('repository_category', function (Blueprint $table) {
            //
        });
    }
}
