<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTimeTableImTestTemplates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_test_templates', function (Blueprint $table) {
            $table->dropColumn('limit_time');
            $table->integer('limit_time_hour')->unsigned()->after('slug');
            $table->integer('limit_time_minutes')->unsigned()->after('limit_time_hour');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_test_templates', function (Blueprint $table) {
            $table->string('limit_time')->after('slug');
            $table->dropColumn('limit_time_hour');
            $table->dropColumn('limit_time_minutes');
        });
    }
}
