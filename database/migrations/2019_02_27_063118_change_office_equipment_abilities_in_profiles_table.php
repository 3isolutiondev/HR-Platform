<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeOfficeEquipmentAbilitiesInProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('office_equipment_abilities');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->boolean('has_clerical_grades')->default(1);
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
            $table->dropColumn('has_clerical_grades');
        });
        Schema::table('profiles', function (Blueprint $table) {
            $table->text('office_equipment_abilities')->nullable();
        });
    }
}
