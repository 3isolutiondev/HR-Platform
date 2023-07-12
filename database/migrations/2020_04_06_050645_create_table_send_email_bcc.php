<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSendEmailBcc extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('send_email_bcc', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('send_email_id');
            $table->string('email');
            $table->timestamps();

            $table->foreign('send_email_id')->references('id')->on('send_email')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('send_email_bcc');
    }
}
