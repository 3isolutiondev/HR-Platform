<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropColumnFileDatasetImEvaluationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            $table->dropColumn('file_dataset1');
            $table->dropColumn('file_dataset2');
            $table->dropColumn('file_dataset3');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_evaluation', function (Blueprint $table) {
            $table->json('file_dataset1')->nullable(true);
            $table->json('file_dataset2')->nullable(true);
            $table->json('file_dataset3')->nullable(true);
        });
    }
}
