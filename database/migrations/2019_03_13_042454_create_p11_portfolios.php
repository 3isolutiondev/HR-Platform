<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11Portfolios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_portfolios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('url')->nullable();
            $table->unsignedInteger('attachment_id')->nullable();
            $table->unsignedInteger('profile_id');
            $table->timestamps();

            $table->foreign('attachment_id')->references('id')->on('attachments');
            $table->foreign('profile_id')->references('id')->on('profiles');
        });

        Schema::dropIfExists('portfolio_skill');
        Schema::dropIfExists('portfolios');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_portfolios');

        Schema::create('portfolios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('url')->nullable();
            $table->unsignedInteger('attachment_id')->nullable();
            $table->timestamps();

            $table->foreign('attachment_id')->references('id')->on('attachments');
        });

        Schema::create('portfolio_skill', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('portfolio_id');
            $table->unsignedInteger('skill_id');
            $table->timestamps();

            $table->foreign('portfolio_id')->references('id')->on('portfolios');
            $table->foreign('skill_id')->references('id')->on('skills');
        });
    }
}
