<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterP11EducationSchoolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_education_schools', function (Blueprint $table) {
            $table->dropColumn('country');
            $table->unsignedInteger('country_id');
            $table->dropColumn('certificate_file');
            $table->unsignedInteger('certificate_file_id')->nullable();

            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('profile_id')->references('id')->on('profiles');
            $table->foreign('certificate_file_id')->references('id')->on('attachments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_education_schools', function (Blueprint $table) {
            $table->dropForeign('p11_education_schools_country_id_foreign');
            $table->dropForeign('p11_education_schools_profile_id_foreign');
            $table->dropForeign('p11_education_schools_certificate_file_id_foreign');

            $table->dropColumn('certificate_file_id');
            $table->dropColumn('country_id');

            $table->string('country');
            $table->unsignedInteger('certificate_file')->nullable();
        });
    }
}
