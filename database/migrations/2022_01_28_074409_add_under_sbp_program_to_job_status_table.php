<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUnderSbpProgramToJobStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_status', function (Blueprint $table) {
            $table->string('under_sbp_program')->default('no')->comment('jobs step under sbp program: yes/no');
            $table->string('status_under_sbp_program')->nullable()->comment('status name if under_sbp_program = yes');
        });

        Schema::table('hr_job_standards', function (Blueprint $table) {
            $table->string('under_sbp_program')->default('no')->comment('job standard for sbp program: yes/no');
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
            $table->dropColumn('status_under_sbp_program');
            $table->dropColumn('under_sbp_program');
        });

        Schema::table('hr_job_standards', function (Blueprint $table) {
            $table->dropColumn('under_sbp_program');
        });
    }
}
