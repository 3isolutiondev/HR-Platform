<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGovermentPaperFieldsOnTar extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->string('need_government_paper')->default('no');
            $table->boolean('need_government_paper_now')->nullable();
            $table->unsignedInteger('government_paper_id')->nullable();

            $table->foreign('government_paper_id','tar_itineraries_paper_id')->references('id')->on('attachments')->onDelete('set null');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->string('need_government_paper')->default('no');
            $table->boolean('need_government_paper_now')->nullable();
            $table->unsignedInteger('government_paper_id')->nullable();

            $table->foreign('government_paper_id','tar_itineraries_version_paper_id')->references('id')->on('attachments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('security_module_tar_request_itineraries', function (Blueprint $table) {
            $table->dropForeign('tar_itineraries_paper_id');
            $table->dropColumn('need_government_paper');
            $table->dropColumn('need_government_paper_now');
            $table->dropColumn('government_paper_id');
        });

        Schema::table('security_module_tar_request_itineraries_revision', function (Blueprint $table) {
            $table->dropForeign('tar_itineraries_version_paper_id');
            $table->dropColumn('need_government_paper');
            $table->dropColumn('need_government_paper_now');
            $table->dropColumn('government_paper_id');
        });
    }
}
