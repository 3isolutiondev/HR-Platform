<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNullableToImEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            
            $table->string('text1')->nullable()->change();
            $table->string('file_dataset1')->nullable()->change();
            $table->string('file_dataset2')->nullable()->change();
            $table->string('file_dataset3')->nullable()->change();
            $table->json('question_title1')->nullable()->change();
            $table->json('answers1')->nullable()->change();
            $table->json('true_answers1')->nullable()->change();
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
