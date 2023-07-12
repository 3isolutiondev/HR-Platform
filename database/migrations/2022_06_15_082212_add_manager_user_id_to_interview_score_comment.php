<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddManagerUserIdToInterviewScoreComment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('interview_score_comments', function (Blueprint $table) {
            if(!Schema::hasColumn('interview_score_comments', 'manager_user_id')) {
                $table->unsignedInteger('manager_user_id')->nullable();
                $table->foreign('manager_user_id')->references('id')->on('users')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('interview_score_comments', function (Blueprint $table) {
            $table->dropForeign('manager_user_id');
            $table->dropColumn('manager_user_id');
        });
    }
}
