<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImTestTemplateToProfileRosterProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profile_roster_processes', function (Blueprint $table) {
            $table->unsignedBigInteger('im_test_template_id')->nullable()->after('skype_invitation_done');
            $table->string('im_test_timezone')->nullable()->after('im_test_template_id');
            $table->timestamp('im_test_submit_date')->nullable()->after('im_test_timezone');
            $table->boolean('im_test_invitation_done')->default(0)->after('im_test_submit_date');

            $table->foreign('im_test_template_id')->references('id')->on('im_test_templates');
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
            $table->dropForeign('profile_roster_processes_im_test_template_id_foreign');
            $table->dropColumn('im_test_template_id');
            $table->dropColumn('im_test_timezone');
            $table->dropColumn('im_test_invitation_done');
            $table->dropColumn('im_test_submit_date');
        });
    }
}
