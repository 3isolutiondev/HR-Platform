<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnProfilIdAndPreferenceId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_answer_question_reference', function (Blueprint $table) {
            // $table->integer('p11_references_id')->unsigned()->nullable();
            // $table->integer('profil_id')->unsigned();
            // $table->foreign('p11_references_id')->references('id')->on('p11_references');

            // $table->foreign('profil_id')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_answer_question_reference', function (Blueprint $table) {
            //
        });
    }
}
