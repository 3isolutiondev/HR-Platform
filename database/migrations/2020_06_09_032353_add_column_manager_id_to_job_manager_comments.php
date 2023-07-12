<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnManagerIdToJobManagerComments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_manager_comments', function (Blueprint $table) {
            $table->unsignedInteger('manager_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_manager_comments', function (Blueprint $table) {
            $table->dropColumn('manager_id');
        });
    }
}
