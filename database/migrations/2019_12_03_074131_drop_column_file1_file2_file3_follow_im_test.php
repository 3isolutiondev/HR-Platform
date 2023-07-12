<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropColumnFile1File2File3FollowImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('follow_im_test', function (Blueprint $table) {
            $table->dropColumn('file1');
            $table->dropColumn('file2');
            $table->dropColumn('file3');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('follow_im_test', function (Blueprint $table) {
            //
        });
    }
}
