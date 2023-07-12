<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobInterviewRequestContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_interview_request_contracts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('job_id');
            $table->unsignedInteger('profile_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->boolean('paid_from')->default(0);
            $table->string('project_code');
            $table->string('project_task')->nullable();
            $table->unsignedInteger('supervisor');
            $table->unsignedInteger('unanet_approver_name');
            $table->string('hosting_agency')->nullable();
            $table->string('duty_station');
            $table->integer('monthly_rate');
            $table->boolean('housing')->default(0);
            $table->boolean('perdiem')->default(0);
            $table->boolean('phone')->default(0);
            $table->boolean('is_other')->default(0);
            $table->boolean('not_available')->default(0);
            $table->string('other')->nullable();
            $table->date('contract_start')->nullable();
            $table->date('contract_end')->nullable();
            $table->timestamps();

            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('supervisor')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('unanet_approver_name')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_interview_request_contracts');
    }
}
