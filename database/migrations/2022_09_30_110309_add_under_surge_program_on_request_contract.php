<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUnderSurgeProgramOnRequestContract extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->boolean('under_surge_program')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->dropColumn('under_surge_program');
        });
    }
}
