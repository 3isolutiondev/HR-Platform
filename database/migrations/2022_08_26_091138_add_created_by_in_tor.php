<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCreatedByInToR extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor', function (Blueprint $table) {
            if(!Schema::hasColumn('hr_tor', 'created_by_id')) {
                $table->unsignedInteger('created_by_id')->nullable();
                $table->foreign('created_by_id')->references('id')->on('users')->onDelete('set null');
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
        Schema::table('hr_tor', function (Blueprint $table) {
            $table->dropForeign('hr_tor_created_by_id_foreign');
            $table->dropColumn('created_by_id');
        });
    }
}
