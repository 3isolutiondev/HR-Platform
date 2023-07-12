<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyTableImEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            
            $table->dropColumn('question_title1');
            $table->dropColumn('answers1');
            $table->dropColumn('true_answers1');
            
            $table->text('text2');
            $table->text('text3');
            $table->string('file_user_up1');
            $table->string('file_user_up2');
            $table->string('file_user_up3');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            //
        });
    }
}
