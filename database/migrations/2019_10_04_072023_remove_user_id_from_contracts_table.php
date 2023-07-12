<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveUserIdFromContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('contracts', 'user_id')) {
            Schema::table('contracts', function (Blueprint $table) {
                $table->dropForeign('contracts_user_id_foreign');
                $table->dropColumn('user_id');
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
        if (!Schema::hasColumn('contracts', 'user_id')) {
            Schema::table('contracts', function (Blueprint $table) {
                $table->integer('user_id')->unsigned()->nullable();
                $table->foreign('user_id')->references('id')->on('users');
            });
        }
    }
}
