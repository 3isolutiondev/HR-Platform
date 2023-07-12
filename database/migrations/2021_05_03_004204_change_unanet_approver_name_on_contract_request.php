<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeUnanetApproverNameOnContractRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('job_interview_request_contracts')) {
            if (Schema::hasColumn('job_interview_request_contracts', 'unanet_approver_name')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->unsignedInteger('unanet_approver_name')->nullable()->change();
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
            if (Schema::hasColumn('job_interview_request_contracts', 'unanet_approver_name')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->unsignedInteger('unanet_approver_name')->nullable(false)->change();
                });
            }
        }
    }
}
