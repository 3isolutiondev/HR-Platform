<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddImmapOfficeIdToTorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->unsignedBigInteger('immap_office_id')->nullable()->after('country_id');

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
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropForeign('hr_tor_immap_office_id_foreign');
            $table->dropColumn('immap_office_id');
        });
    }
}
