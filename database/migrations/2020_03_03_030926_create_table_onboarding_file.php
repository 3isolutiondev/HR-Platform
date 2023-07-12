<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableOnboardingFile extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('onboarding_file', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('contact_id')->unsigned();
            $table->unsignedBigInteger('media_id')->nullable();
            $table->string('file_type', 50)->nullable();
            $table->string('file_name')->nullable();
            $table->string('name')->nullable();

            $table->timestamps();
            $table->foreign('contact_id')->references('id')->on('contact_information')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('onboarding_file');
    }
}
