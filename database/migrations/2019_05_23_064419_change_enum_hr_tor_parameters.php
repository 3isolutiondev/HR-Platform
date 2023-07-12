<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeEnumHrTorParameters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hr_tor_parameters', function (Blueprint $table) {
            DB::statement("ALTER TABLE hr_tor_parameters CHANGE COLUMN field_type field_type ENUM('text', 'select', 'autocomplete', 'added_on_tor') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hr_tor_parameters', function (Blueprint $table) {
            DB::statement("ALTER TABLE hr_tor_parameters CHANGE COLUMN field_type field_type ENUM('text', 'select', 'autocomplete') NOT NULL");
        });
    }
}
