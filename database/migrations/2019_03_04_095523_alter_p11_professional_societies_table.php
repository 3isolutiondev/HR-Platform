<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterP11ProfessionalSocietiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p11_professional_societies', function (Blueprint $table) {
            $table->date('attended_from');
            $table->date('attended_to');
            $table->unsignedInteger('country_id');

            $table->dropColumn('country');
            $table->dropColumn('year');

            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('p11_professional_societies', function (Blueprint $table) {
            $table->dropForeign('p11_professional_societies_country_id_foreign');
            $table->dropForeign('p11_professional_societies_profile_id_foreign');

            $table->dropColumn('country_id');
            $table->dropColumn('attended_from');
            $table->dropColumn('attended_to');

            $table->string('country');
            $table->date('year');
        });
    }
}
