<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnMultipleChoiceImTestIdToImTestAnswer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_test_answer', function (Blueprint $table) {
            $table->bigInteger('multiple_choice_im_test_id')->unsigned()->nullable();

            $table->foreign('multiple_choice_im_test_id')->references('id')
                ->on('multiple_choice_im_test')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_test_answer', function (Blueprint $table) {
            //
        });
    }
}
