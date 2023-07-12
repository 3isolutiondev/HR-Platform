<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveNameSlugFromP11LanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_languages', function (Blueprint $table) {
            $table->unsignedInteger('language_id');
            $table->dropColumn('name');
            $table->dropColumn('slug');

            $table->foreign('language_id')->references('id')->on('languages');
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
            $table->string('name');
            $table->string('slug')->unique();
            $table->dropForeign(['language_id']);
        });
    }
}
