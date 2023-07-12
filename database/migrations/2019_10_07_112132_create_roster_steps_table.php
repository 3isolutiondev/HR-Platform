<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRosterStepsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roster_steps', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('step');
            $table->string('slug');
            $table->boolean('default_step')->default(0);
            $table->boolean('last_step')->default(0);
            $table->boolean('has_quiz')->default(0);
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
        Schema::dropIfExists('roster_steps');
    }
}
