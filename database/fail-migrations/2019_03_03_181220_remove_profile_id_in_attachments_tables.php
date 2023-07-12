<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveProfileIdInAttachmentsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropForeign('attachments_profile_id_foreign');
            $table->dropForeign('attachments_user_id_foreign');

            $table->dropColumn('profile_id');
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('profile_id');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }
}
