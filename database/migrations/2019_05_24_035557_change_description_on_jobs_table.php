<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDescriptionOnJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->bigInteger('tor_id')->unsigned()->nullable();
            $table->renameColumn('description','description_of_duties');
            $table->dropColumn('responsibilities');
            $table->dropColumn('terms_and_conditions');

            $table->foreign('tor_id')->references('id')->on('hr_tor');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropForeign('jobs_tor_id_foreign');
            $table->dropColumn('tor_id');
            $table->renameColumn('description_of_duties', 'description');
            $table->text('responsibilities');
            $table->text('terms_and_conditions');
        });
    }
}
