<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeRosterStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('roster_steps', 'roster_process_id')) {
            Schema::table('roster_steps', function (Blueprint $table) {
                $table->bigInteger('roster_process_id')->unsigned()->nullable()->after('has_quiz');
                $table->integer('order')->default(0);
                $table->foreign('roster_process_id')->references('id')->on('roster_processes');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('roster_steps', 'roster_process_id')) {
            Schema::table('roster_steps', function (Blueprint $table) {
                $table->dropForeign('roster_steps_roster_process_id_foreign');
                $table->dropColumn('roster_process_id');
                $table->dropColumn('order');
            });
        }
    }
}
