<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDiplomaFileP11EducationUniversitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_education_universities', function (Blueprint $table) {
            $table->unsignedInteger('diploma_file_id')->nullable();
            $table->dropColumn('diploma_file');

            $table->foreign('diploma_file_id')->references('id')->on('attachments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_education_universities', function (Blueprint $table) {
            $table->dropForeign('diploma_file_id');
            $table->dropColumn('diploma_file_id');
            $table->unsignedInteger('diploma_file')->nullable();
        });
    }
}
