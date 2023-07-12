<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNullableToApplicant extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('applicant', function (Blueprint $table) {
            $table->string('file_answers1')->nullable()->change();
            $table->string('file_answers2')->nullable()->change();
            $table->string('file_answers3')->nullable()->change();
            $table->json('quiz_answers')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('applicant', function (Blueprint $table) {
            //
        });
    }
}
