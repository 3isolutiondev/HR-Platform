<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AllowNullToFollowImTestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('follow_im_test', function (Blueprint $table) {
            $table->string('file1')->nullable()->change();
            $table->string('file2')->nullable()->change();
            $table->string('file3')->nullable()->change();
            $table->text('text1')->nullable()->change();
            $table->text('text2')->nullable()->change();
            $table->text('text3')->nullable()->change();
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
