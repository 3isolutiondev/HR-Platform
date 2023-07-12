<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePortfolioSkillTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('portfolio_skill', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('portfolio_id');
            $table->unsignedInteger('skill_id');
            $table->timestamps();

            $table->foreign('portfolio_id')->references('id')->on('portfolios');
            $table->foreign('skill_id')->references('id')->on('skills');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('portfolio_skill');
    }
}
