<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EnlargeQuestionText extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->text('question')->change();
        });

        Schema::table('interview_scores', function (Blueprint $table) {
            $table->text('comment')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->string('question')->change();
        });

        Schema::table('interview_scores', function (Blueprint $table) {
            $table->string('comment')->nullable()->change();
        });
    }
}
