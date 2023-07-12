<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropColumnProfilIdToUserAnswerQuestionReference extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_answer_question_reference', function (Blueprint $table) {
            // $table->integer('profil_id')->unsigned();
            // $table->foreign('profil_id')->references('id')->on('profiles')->onDelete('cascade');
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
