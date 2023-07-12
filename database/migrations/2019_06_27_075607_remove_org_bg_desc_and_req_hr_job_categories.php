<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveOrgBgDescAndReqHrJobCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropColumn('organization');
            $table->dropColumn('background');
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
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->text('organization');
            $table->text('background');
            $table->text('description_of_duties');
            $table->text('requirements');
        });
    }
}
