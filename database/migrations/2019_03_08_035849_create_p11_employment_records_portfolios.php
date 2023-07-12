<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateP11EmploymentRecordsPortfolios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p11_employment_records_portfolios', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('employment_record_id');
            $table->unsignedInteger('portfolio_id');
            $table->timestamps();

            $table->foreign('employment_record_id')->references('id')->on('p11_employment_records');
            $table->foreign('portfolio_id')->references('id')->on('portfolios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('p11_employment_records_portfolios');
    }
}
