<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddJobCategoryToRosterProcesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_processes', function (Blueprint $table) {
            $table->integer('hr_job_category_id')->unsigned()->nullable()->after('is_default');

            $table->foreign('hr_job_category_id')->references('id')->on('hr_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_processes', function (Blueprint $table) {
            $table->dropForeign('roster_processes_hr_job_category_id_foreign');
            $table->dropColumn('hr_job_category_id');
        });
    }
}
