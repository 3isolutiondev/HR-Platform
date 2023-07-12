<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifiedPreviouslyWorkedWithImmap extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->string('project')->nullable()->change();
            $table->string('duty_station')->nullable();
            $table->string('line_manager')->nullable();
            $table->string('position')->nullable();
            $table->bigInteger('immap_office_id')->unsigned()->nullable();

            $table->foreign('immap_office_id')->references('id')->on('immap_offices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_submitted_application_in_un', function (Blueprint $table) {
            $table->dropForeign('p11_submitted_application_in_un_immap_office_id_foreign');
            $table->dropColumn('immap_office_id');
            $table->dropColumn('line_manager');
            $table->dropColumn('duty_station');
            $table->dropColumn('position');
            $table->string('project')->nullable(false)->change();
        });
    }
}
