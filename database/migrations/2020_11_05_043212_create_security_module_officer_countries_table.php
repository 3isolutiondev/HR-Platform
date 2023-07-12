<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSecurityModuleOfficerCountriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('security_module_officer_countries')) {
            Schema::create('security_module_officer_countries', function (Blueprint $table) {
                $table->unsignedInteger('user_id');
                $table->unsignedInteger('country_id');

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('security_module_officer_countries')) {
            Schema::dropIfExists('security_module_officer_countries');
        };
    }
}
