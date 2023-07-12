<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameNotAvailableToNotApplicable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('job_interview_request_contracts')) {
            if (Schema::hasColumn('job_interview_request_contracts', 'not_available')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->renameColumn('not_available','not_applicable');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('job_interview_request_contracts')) {
            if (Schema::hasColumn('job_interview_request_contracts', 'not_applicable')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->renameColumn('not_applicable','not_available');
                });
            }
        }
    }
}
