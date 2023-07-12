<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAndModifyFieldsOnRequestContracts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->unsignedInteger('job_id')->nullable()->change();
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
            $table->string('project_code')->nullable()->change();
            $table->unsignedInteger('supervisor')->nullable()->change();
            $table->string('duty_station')->nullable()->change();
            $table->string('monthly_rate')->nullable()->change();
            $table->string('request_type')->default('new-contract')->after('profile_id');
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
            $table->unsignedInteger('job_id')->nullable(false)->change();
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
            $table->string('project_code')->nullable(false)->change();
            $table->unsignedInteger('supervisor')->nullable(false)->change();
            $table->string('duty_station')->nullable(false)->change();
            $table->string('monthly_rate')->nullable(false)->change();
            $table->dropColumn('request_type');
        });
    }
}
