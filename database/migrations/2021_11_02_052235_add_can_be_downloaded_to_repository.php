<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class addCanBeDownloadedToRepository extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('repository', 'can_be_downloaded')) {
            Schema::table('repository', function (Blueprint $table) {
                $table->boolean('can_be_downloaded')->nullable();
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
        if (Schema::hasColumn('repository', 'can_be_downloaded')) {
            Schema::table('repository', function (Blueprint $table) {
                $table->dropColumn('can_be_downloaded');
            });
        }
    }
}
