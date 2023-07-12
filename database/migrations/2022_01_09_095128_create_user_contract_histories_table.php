<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserContractHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('user_contract_histories')) {
            Schema::create('user_contract_histories', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedInteger('user_id');
                $table->unsignedBigInteger('immap_office_id');
                $table->boolean('is_immap_france')->default(false);
                $table->boolean('is_immap_inc')->default(false);
                $table->string('project_code');
                $table->string('immap_email');
                $table->string('job_title');
                $table->string('duty_station');
                $table->string('line_manager');
                $table->date('start_of_contract');
                $table->date('end_of_contract');
                $table->string('role')->nullable();
                $table->boolean('immap_contract_international')->default(false);
                $table->boolean('under_sbp_program')->default(false);
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('immap_office_id')->references('id')->on('immap_offices')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_contract_histories');
    }
}
