<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTypeColumnRepositoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('repository', function (Blueprint $table) {
            $table->text('name')->change();
            $table->text('file_name')->change();
            $table->text('download_url')->change();
            $table->text('file_url')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('repository', function (Blueprint $table) {
            //
        });
    }
}
