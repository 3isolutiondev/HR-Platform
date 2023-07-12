<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnFile1File2File3FollowImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('follow_im_test', function (Blueprint $table) {
            $table->integer('file1')->nullable();
            $table->integer('file2')->nullable();
            $table->integer('file3')->nullable();

            $table->integer('im_test_templates_id')->nullable();
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
