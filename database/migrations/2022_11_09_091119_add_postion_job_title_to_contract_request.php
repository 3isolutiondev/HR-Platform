<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPostionJobTitleToContractRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->string('position')->nullable();
            $table->unsignedBigInteger('immap_office_id')->nullable();

            $table->foreign('immap_office_id')->references('id')->on('immap_offices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('job_interview_request_contracts', function (Blueprint $table) {
            $table->dropForeign('job_interview_request_contracts_immap_office_id_foreign');
            $table->dropColumn('position');
            $table->dropColumn('immap_office_id');
        });
    }
}
