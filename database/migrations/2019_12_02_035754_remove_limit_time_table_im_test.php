<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveLimitTimeTableImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_test', function (Blueprint $table) {
            $table->dropColumn('limit_time');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_test', function (Blueprint $table) {
            $table->string('limit_time')->nullable()->after('title');
        });
    }
}
