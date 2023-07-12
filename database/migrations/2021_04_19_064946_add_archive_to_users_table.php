<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddArchiveToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'archived_user')) {
                    $table->string('archived_user')->default('no')->comment('Archived Completed Profile (value: yes / no)');
                }
                if (!Schema::hasColumn('users', 'starred_user')) {
                    $table->string('starred_user')->default('no')->comment('Star / Unstar Completed Profile (value: yes / no)');
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
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'archived_user')) {
                    $table->dropColumn('archived_user');
                }
                if (Schema::hasColumn('users', 'archived_user')) {
                    $table->dropColumn('starred_user');
                }
            });

        }
    }
}
