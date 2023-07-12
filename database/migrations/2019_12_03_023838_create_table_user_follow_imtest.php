<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUserFollowImtest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('follow_im_test', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('file1');
            $table->string('file2');
            $table->string('file3');
            $table->text('text1');
            $table->text('text2');
            $table->text('text3');
            $table->bigInteger('im_test_id')->unsigned();
            $table->integer('profil_id')->unsigned();

            $table->foreign('profil_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('im_test_id')->references('id')->on('im_test')->onDelete('cascade');

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
        Schema::dropIfExists('follow_im_test');
    }
}
