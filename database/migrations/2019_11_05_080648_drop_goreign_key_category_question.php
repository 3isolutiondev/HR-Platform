<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropGoreignKeyCategoryQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('question_reference', function (Blueprint $table) {
            $table->dropForeign(['category_question_reference_id']);
            $table->dropColumn('category_question_reference_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('question_reference', function (Blueprint $table) {
            //
        });
    }
}
