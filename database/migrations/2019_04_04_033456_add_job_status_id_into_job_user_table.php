<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddJobStatusIdIntoJobUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_user', function (Blueprint $table) {
            $table->dropColumn('job_status');
            $table->unsignedInteger('job_status_id')->nullable();

            $table->foreign('job_status_id')->references('id')->on('job_status');
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
            $table->enum('job_status', ['active', 'approved', 'accepted', 'rejected'])->default('active');
            $table->dropForeign('job_user_job_status_id_foreign');
            $table->dropColumn('job_status_id');
        });
    }
}
