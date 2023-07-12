<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProfileIdToEmploymentRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('employment_records', function (Blueprint $table) {
            $table->text('employer_address')->nullable()->change();
            $table->unsignedInteger('profile_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employment_records', function (Blueprint $table) {
            $table->dropColumn('profile_id');
            $table->string('employer_address')->change();
        });
    }
}
