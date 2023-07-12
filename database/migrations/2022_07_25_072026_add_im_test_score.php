<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImTestScore extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->text('im_test_sharepoint_link')->nullable();
            $table->unsignedInteger('im_test_score')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->dropColumn('im_test_sharepoint_link');
            $table->dropColumn('im_test_score');
        });
    }
}
