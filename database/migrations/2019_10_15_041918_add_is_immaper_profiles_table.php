<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsImmaperProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->boolean('is_immaper')->default(0);
            $table->boolean('verified_immaper')->default(0);
            $table->string('immap_email')->nullable();
            $table->bigInteger('immap_office_id')->unsigned()->nullable();
            $table->string('project')->nullable();

            $table->foreign('immap_office_id')->references('id')->on('immap_offices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropForeign('profiles_immap_office_id_foreign');
            $table->dropColumn('immap_office_id');
            $table->dropColumn('immap_email');
            $table->dropColumn('verified_immaper');
            $table->dropColumn('is_immaper');
            $table->dropColumn('project');
        });
    }
}
