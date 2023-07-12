<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeNullableJobLanguageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_language', function (Blueprint $table) {
            $table->boolean('read')->nullable()->change();
            $table->boolean('write')->nullable()->change();
            $table->boolean('speak')->nullable()->change();
            $table->boolean('understand')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_language', function (Blueprint $table) {
            $table->unsignedInteger('read')->change();
            $table->unsignedInteger('write')->change();
            $table->unsignedInteger('speak')->change();
            $table->unsignedInteger('understand')->change();
        });
    }
}
