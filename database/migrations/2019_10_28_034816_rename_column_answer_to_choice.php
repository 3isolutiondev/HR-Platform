<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameColumnAnswerToChoice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mchoice', function (Blueprint $table) {
            $table->renameColumn('answer', 'choice');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mchoice', function (Blueprint $table) {
            $table->renameColumn('choice', 'answer');
        });
    }
}
