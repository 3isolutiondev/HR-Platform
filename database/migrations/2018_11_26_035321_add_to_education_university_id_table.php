<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddToEducationUniversityIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->unsignedInteger('education_university_id')->nullable();
            $table->unsignedInteger('education_school_id')->nullable();
            $table->unsignedInteger('profile_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn('education_university_id');
            $table->dropColumn('education_school_id');
            $table->dropColumn('profile_id');
            $table->dropColumn('user_id');
        });
    }
}
