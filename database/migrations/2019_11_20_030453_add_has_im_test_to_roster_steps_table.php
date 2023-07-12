<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHasImTestToRosterStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $table->boolean('has_im_test')->default(0)->after('has_quiz');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $Table->dropColumn('has_im_test');
        });
    }
}
