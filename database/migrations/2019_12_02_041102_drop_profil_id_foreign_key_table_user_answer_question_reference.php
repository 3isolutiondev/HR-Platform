<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropProfilIdForeignKeyTableUserAnswerQuestionReference extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('user_answer_question_reference', 'profil_id')) {
            Schema::table('user_answer_question_reference', function (Blueprint $table) {
                // $table->dropForeign(['profil_id']);
                // $table->dropForeign('user_answer_question_reference_profil_id_foreign');
                // $table->dropColumn('profil_id');
                // $table->dropForeign(['profil_id']); adit ubah
                // $table->dropColumn('profil_id');
                // $table->dropIndex('profil_id');
            });
        }
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
