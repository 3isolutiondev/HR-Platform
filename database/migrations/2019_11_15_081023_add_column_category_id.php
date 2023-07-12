<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnCategoryId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('question_reference', function (Blueprint $table) {
            $table->bigInteger('category_question_reference_id')->unsigned()->nullable();

            $table->foreign('category_question_reference_id')->references('id')->on('category_question_reference')
            ->onDelete('cascade');
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
