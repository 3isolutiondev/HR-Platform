<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSetAsShortlistedInJobStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('job_status')) {
            Schema::table('job_status', function (Blueprint $table) {
                if (!Schema::hasColumn('job_status', 'set_as_shortlist')) {
                    $table->boolean('set_as_shortlist')->default(0);
                }
                if (!Schema::hasColumn('job_status', 'set_as_rejected')) {
                    $table->boolean('set_as_rejected')->default(0);
                }
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
        if (Schema::hasTable('job_status')) {
            Schema::table('job_status', function (Blueprint $table) {
                if (Schema::hasColumn('job_status', 'set_as_shortlist')) {
                    $table->dropColumn('set_as_shortlist');
                }
                if (Schema::hasColumn('job_status', 'set_as_rejected')) {
                    $table->dropColumn('set_as_rejected');
                }
            });
        }
    }
}
