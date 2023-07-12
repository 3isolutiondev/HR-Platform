<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn('education_university_id');
            $table->dropColumn('education_school_id');

            $table->foreign('profile_id')->references('id')->on('profiles');
            $table->foreign('user_id')->references('id')->on('users');
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
            $table->dropForeign(['profile_id', 'user_id']);
            $table->unsignedInteger('education_university_id');
            $table->unsignedInteger('education_school_id');
        });
    }
}
