<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImmapOfficesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('immap_offices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('country_id')->unsigned()->nullable();
            $table->boolean('is_active')->default(1);
            // $table->boolean('show_in')
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('immap_offices');
    }
}
