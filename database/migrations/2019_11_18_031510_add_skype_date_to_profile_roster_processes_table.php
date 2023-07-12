<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSkypeDateToProfileRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->string('skype')->nullable()->after('is_completed');
            $table->timestamp('skype_date')->nullable()->after('skype');
            $table->string('skype_timezone')->nullable()->after('skype_date');
            $table->boolean('skype_invitation_done')->default(0)->after('skype_timezone');
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
            $table->dropColumn('skype');
            $table->dropColumn('skype_date');
            $table->dropColumn('skype_timezone');
            $table->dropColumn('skype_invitation_done');
        });
    }
}
