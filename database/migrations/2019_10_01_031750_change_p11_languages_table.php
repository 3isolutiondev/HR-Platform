<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeP11LanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_languages', function (Blueprint $table) {
            $table->dropColumn('read');
            $table->dropColumn('write');
            $table->dropColumn('speak');
            $table->dropColumn('understand');
            $table->bigInteger('language_level_id')->unsigned()->nullable();

            $table->foreign('language_level_id')->references('id')->on('language_levels');//->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_languages', function (Blueprint $table) {
            $table->dropForeign('p11_languages_language_level_id_foreign');
            $table->dropColumn('language_level_id');
            $table->boolean('read')->default(0);
            $table->boolean('write')->default(0);
            $table->boolean('speak')->default(0);
            $table->boolean('understand')->default(0);
        });
    }
}
