<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemovePreferredFieldOfWorkFromProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn(['legal_permanent_residence_status_country', 'preferred_field_of_work']);
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
            $table->unsignedInteger('legal_permanent_residence_status_country')->nullable();
            $table->string('preferred_field_of_work')->nullable();
        });
    }
}
