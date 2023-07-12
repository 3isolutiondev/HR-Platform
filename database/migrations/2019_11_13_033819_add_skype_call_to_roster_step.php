<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSkypeCallToRosterStep extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $table->boolean('has_skype_call')->default(0)->after('has_quiz');
            $table->boolean('has_interview')->default(0)->after('has_skype_call');
            $table->boolean('has_reference_check')->default(0)->after('has_interview');
            $table->boolean('set_rejected')->default(0)->after('has_reference_check');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roster_steps', function (Blueprint $table) {
            $table->dropColumn('has_skype_call');
            $table->dropColumn('has_interview');
            $table->dropColumn('has_reference_check');
            $table->dropColumn('set_rejected');
        });
    }
}
