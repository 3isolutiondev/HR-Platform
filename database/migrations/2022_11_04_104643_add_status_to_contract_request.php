<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatusToContractRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->string('request_status')->default('unsent')->comment('Contract Request Status, (value: done, sent, unsent)');
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
            $table->dropColumn('being_processed');
        });
    }
}
