<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11SubmittedApplicationInUnTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_submitted_application_in_un', function (Blueprint $table) {
            $bmonth = [
                '01','02','03','04','05','06','07','08','09','10',
                '11','12'
            ];

            $table->increments('id');
            $table->enum('bmonth', $bmonth);
            $table->year('byear');
            $table->unsignedInteger('un_organization_id');
            $table->unsignedInteger('profile_id');
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
        Schema::dropIfExists('p11_submitted_application_in_un');
    }
}
