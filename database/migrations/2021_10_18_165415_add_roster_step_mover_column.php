<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRosterStepMoverColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('profile_roster_processes')) {
            if (!Schema::hasColumn('profile_roster_processes', 'mover_id')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->unsignedInteger('mover_id')->nullable();

                    $table->foreign('mover_id')->references('id')->on('users')->onDelete('cascade');
                });
            }
            if (!Schema::hasColumn('profile_roster_processes', 'moved_date')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->date('moved_date')->nullable();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('profile_roster_processes')) {
            if (Schema::hasColumn('profile_roster_processes', 'mover_id')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->dropForeign('profile_roster_processes_mover_id_foreign');
                    $table->dropColumn('mover_id');
                });
            }
            if (!Schema::hasColumn('profile_roster_processes', 'moved_date')) {
                Schema::table('profile_roster_processes', function (Blueprint $table) {
                    $table->dropColumn('moved_date')->nullable();
                 });
            }
        }
    }
}
