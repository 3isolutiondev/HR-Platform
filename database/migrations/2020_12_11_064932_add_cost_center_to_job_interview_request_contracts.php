<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCostCenterToJobInterviewRequestContracts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('job_interview_request_contracts')) {
            if (!Schema::hasColumn('job_interview_request_contracts', 'cost_center')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->unsignedBigInteger('cost_center')->nullable();

                    $table->foreign('cost_center')->references('id')->on('immap_offices')->onDelete('cascade');
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
            if (Schema::hasColumn('job_interview_request_contracts', 'cost_center')) {
                Schema::table('job_interview_request_contracts', function (Blueprint $table) {
                    $table->dropForeign('job_interview_request_contracts_cost_center_foreign');
                    $table->dropColumn('cost_center');
                });

            }
        }
    }
}
