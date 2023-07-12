<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNullableTableImEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            $table->string('text2')->nullable()->change();
            $table->string('text3')->nullable()->change();
            $table->string('file_user_up1')->nullable()->change();
            $table->string('file_user_up2')->nullable()->change();
            $table->string('file_user_up3')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            //
        });
    }
}
