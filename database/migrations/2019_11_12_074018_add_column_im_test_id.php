<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnImTestId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('applicant', function (Blueprint $table) {
            $table->bigInteger('im_test_id')->unsigned()->nullable(true);

            $table->foreign('im_test_id')->references('id')->on('im_test');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('applicant', function (Blueprint $table) {
            //
        });
    }
}
