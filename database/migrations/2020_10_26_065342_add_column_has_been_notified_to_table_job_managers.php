<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnHasBeenNotifiedToTableJobManagers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_managers', function (Blueprint $table) {
            $table->string('has_been_notified', 1)->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_managers', function (Blueprint $table) {
            $table->dropColumn('has_been_notified');
        });
    }
}
