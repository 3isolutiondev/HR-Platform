<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveDescAndReqHrJobCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_job_categories', function (Blueprint $table) {
            $table->dropColumn('description_of_duties');
            $table->dropColumn('requirements');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_job_categories', function (Blueprint $table) {
            $table->text('description_of_duties')->nullable();
            $table->text('requirements')->nullable();
        });
    }
}
