<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAttachmentIdToP11References extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_references', function (Blueprint $table) {
            $table->unsignedInteger('attachment_id')->nullable();
            $table->foreign('attachment_id')->references('id')->on('attachments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_references', function (Blueprint $table) {
            $table->dropForeign(['attachment_id']);
            $table->dropColumn('attachment_id');
        });
    }
}
