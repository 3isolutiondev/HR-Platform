<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddQuizTemplateIdInRosterStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $table->bigInteger('quiz_template_id')->unsigned()->nullable()->after('roster_process_id');

            $table->foreign('quiz_template_id')->references('id')->on('roster_steps');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $table->dropForeign('roster_steps_quiz_template_id_foreign');
            $table->dropColumn('quiz_template_id');
        });
    }
}
