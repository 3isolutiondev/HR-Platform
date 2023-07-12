<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDepartingNStartDateToJobUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_user', function (Blueprint $table) {
            $table->date('start_date_availability')->nullable();
            $table->text('departing_from')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_user', function (Blueprint $table) {
            $table->dropColumn('departing_from');
            $table->dropColumn('start_date_availability');
        });
    }
}
