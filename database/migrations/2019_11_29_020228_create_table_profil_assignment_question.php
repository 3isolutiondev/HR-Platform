<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProfilAssignmentQuestion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profil_assignment_question', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('profil_id')->unsigned();
            $table->bigInteger('category_question_reference_id')->unsigned();
            $table->timestamps();

            $table->foreign('profil_id')->references('id')->on('profiles')->onDelete('cascade');
            $table->foreign('category_question_reference_id', 'profil_assignment_question_cqr_id_foreign')->references('id')->on('category_question_reference');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profil_assignment_question');
    }
}
