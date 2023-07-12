<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddContractDateToJobInterviewRequestContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('job_interview_request_contracts')) {
            if (!Schema::hasColumn('job_interview_request_contracts', 'contract_start') && !Schema::hasColumn('job_interview_request_contracts', 'contract_end')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->date('contract_start')->nullable();
                    $table->date('contract_end')->nullable();
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
            if (Schema::hasColumn('job_interview_request_contracts', 'contract_start') && Schema::hasColumn('job_interview_request_contracts', 'contract_end')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->dropColumn('contract_start');
                    $table->dropColumn('contract_end');
                });
            }
        }
    }
}
