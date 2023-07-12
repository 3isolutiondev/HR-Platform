<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddInterviewTypeAndInterviewAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->boolean('interview_type')->default(0);
            $table->string('interview_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            Schema::dropIfExists('interview_type');
            Schema::dropIfExists('interview_address');
        });
    }
}
