<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableContactInformation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_information', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('middle_initial')->nullable();
            $table->string('mailing_address');
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20);
            $table->string('fax', 20)->nullable();
            $table->string('other')->nullable();
            $table->string('passport')->nullable();
            $table->date('passport_expiration_date')->nullable();
            $table->string('issuing_location')->nullable();
            $table->string('email', 50);
            $table->json('emergency_contact_information')->nullable();
            $table->json('beneficiary_contact_information')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_information');
    }
}
