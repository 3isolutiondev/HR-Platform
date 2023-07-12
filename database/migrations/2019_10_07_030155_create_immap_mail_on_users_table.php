<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImmapMailOnUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('users', 'immap_email')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('immap_email')->unique()->nullable();
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
        if (Schema::hasColumn('users', 'immap_email')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('immap_email');
            });
        }
    }
}
