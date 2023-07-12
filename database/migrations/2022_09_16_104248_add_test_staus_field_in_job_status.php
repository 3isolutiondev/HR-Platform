<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTestStausFieldInJobStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_status', function (Blueprint $table) {
            $table->boolean('set_as_test')->default(false);
            $table->boolean('set_as_first_test')->default(false);
            $table->boolean('set_as_second_test')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_status', function (Blueprint $table) {
            $table->dropColumn('set_as_test');
            $table->dropColumn('set_as_first_test');
            $table->dropColumn('set_as_second_test');
        });
    }
}
