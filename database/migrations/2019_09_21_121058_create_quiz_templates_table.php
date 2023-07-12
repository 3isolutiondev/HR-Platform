<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuizTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_templates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->integer('duration')->default(1);
            $table->integer('pass_score')->default(70);
            $table->timestamps();
        });

        Schema::create('quiz_template_mc_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('quiz_template_id')->unsigned()->nullable();
            $table->text('question');
            $table->integer('score')->default(0);
            $table->timestamps();

            $table->foreign('quiz_template_id')->references('id')->on('quiz_templates');
        });

        Schema::create('quiz_template_mc_question_answers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('quiz_template_mcq_id')->unsigned()->nullable();
            $table->text('answer');
            $table->tinyInteger('is_correct')->default(0);
            $table->timestamps();

            $table->foreign('quiz_template_mcq_id')->references('id')->on('quiz_template_mc_questions');
        });

        Schema::create('quiz_template_essay_questions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('quiz_template_id')->unsigned()->nullable();
            $table->text('question');
            $table->integer('score')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_template_mc_question_answers');
        Schema::dropIfExists('quiz_template_mc_questions');
        Schema::dropIfExists('quiz_template_essay_questions');
        Schema::dropIfExists('quiz_templates');
    }
}
