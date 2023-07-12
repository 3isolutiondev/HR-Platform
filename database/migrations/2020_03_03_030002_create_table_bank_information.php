<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableBankInformation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_information', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('contact_id')->unsigned();
            $table->json('if_account_in_us')->nullable();
            $table->json('if_account_overseas')->nullable();
            $table->json('if_foreign_currency_overseas')->nullable();
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
        Schema::dropIfExists('bank_information');
    }
}
