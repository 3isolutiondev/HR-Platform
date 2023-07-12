<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDataset123ToTableImTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('im_test', function (Blueprint $table) {
            $table->dropColumn('file_dataset1');
            $table->dropColumn('file_dataset2');
            $table->dropColumn('file_dataset3');
        });

        Schema::table('im_test', function (Blueprint $table) {
		    $table->integer('file_dataset1')->nullable()->after('text3');
            $table->integer('file_dataset2')->nullable()->after('file_dataset1');
            $table->integer('file_dataset3')->nullable()->after('file_dataset2');

        });

        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('im_test', function (Blueprint $table) {
            $table->dropColumn('file_dataset1');
            $table->dropColumn('file_dataset2');
            $table->dropColumn('file_dataset3');
        });
    }
}
