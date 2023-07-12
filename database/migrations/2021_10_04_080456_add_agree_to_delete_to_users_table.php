<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAgreeToDeleteToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('delete_account_request')->default('not yet')->comment('Delete account request (value: yes / not yet)');
            $table->timestamp('delete_account_request_time')->nullable()->comment('The date when the user create the delete account request');
            $table->string('delete_account_token')->nullable()->comment('Token for verified delete user request');
            $table->timestamp('delete_account_token_expired_at')->nullable()->comment('Time where delete user token expired');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('delete_account_request');
            $table->dropColumn('delete_account_request_time');
            $table->dropColumn('delete_account_token');
            $table->dropColumn('delete_account_token_expired_at');
        });
    }
}
