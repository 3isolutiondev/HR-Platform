<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddReadMoreTextToRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('roster_processes')) {
            if (!Schema::hasColumn('roster_processes', 'read_more_text')) {
                Schema::table('roster_processes', function (Blueprint $table) {
                    $table->text('read_more_text')->nullable();
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
        if (Schema::hasTable('roster_processes')) {
            if (Schema::hasColumn('roster_processes', 'read_more_text')) {
                Schema::table('roster_processes', function (Blueprint $table) {
                    $table->dropColumn('read_more_text');
                });
            }
        }
    }
}
