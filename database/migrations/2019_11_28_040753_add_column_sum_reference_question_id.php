<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnSumReferenceQuestionId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_answer_question_reference', function (Blueprint $table) {

            // $table->dropForeign(['profil_id']);
            // $table->dropColumn('profil_id');            
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
