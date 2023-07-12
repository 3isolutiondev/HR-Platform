<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNullableJobStandartIdJobCategoryId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropForeign(['job_standard_id']);
            $table->dropForeign(['job_category_id']);

            $table->boolean('with_template')->default(1)->after('job_category_id');

            $table->unsignedInteger('job_standard_id')->nullable()->change();
            $table->unsignedInteger('job_category_id')->nullable()->change();

            $table->foreign('job_standard_id')->references('id')->on('hr_job_standards');
            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropForeign(['job_standard_id']);
            $table->dropForeign(['job_category_id']);

            $table->dropColumn('with_template');
            $table->unsignedInteger('job_standard_id')->nullable(false)->change();
            $table->unsignedInteger('job_category_id')->nullable(false)->change();

            $table->foreign('job_standard_id')->references('id')->on('hr_job_standards');
            $table->foreign('job_category_id')->references('id')->on('hr_job_categories');
        });
    }
}
