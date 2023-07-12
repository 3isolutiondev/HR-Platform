<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11PortfoliosSectorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_portfolios_sectors', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('p11_portfolio_id');
            $table->unsignedInteger('sector_id');
            $table->timestamps();

            $table->foreign('p11_portfolio_id')->references('id')->on('p11_portfolios');
            $table->foreign('sector_id')->references('id')->on('sectors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_portfolios_sectors');
    }
}
