<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsImmapIncToHrTorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->boolean('is_immap_inc')->default(0)->after('max_salary');
            $table->boolean('is_immap_france')->default(0)->after('is_immap_inc');
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
            $table->dropColumn('is_immap_inc');
            $table->dropColumn('is_immap_france');
        });
    }
}
