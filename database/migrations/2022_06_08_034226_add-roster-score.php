<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRosterScore extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->unsignedBigInteger('roster_process_id')->nullable();
            $table->foreign('roster_process_id')->references('id')->on('roster_processes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('interview_questions', function (Blueprint $table) {
            $table->foreign('roster_process_id');
            $table->dropColumn('roster_process_id');
        });
    }
}
