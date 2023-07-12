<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPublicationFilesToP11Publications extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_publications', function (Blueprint $table) {
            $table->integer('publication_file_id')->unsigned()->nullable();
            $table->string('url')->nullable();

            $table->foreign('publication_file_id')->references('id')->on('attachments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_publications', function (Blueprint $table) {
            $table->dropForeign('p11_publications_publication_file_id_foreign');
            $table->dropColumn('publication_file_id');
            $table->dropColumn('url');
        });
    }
}
