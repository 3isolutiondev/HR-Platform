<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveAndChangeImTelplatesId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // tabel awal im_evaluation, tapi di ganti dengan im_test
        // jika error saat migrate ganti im_test_im_test_templates_id_foreign ke im_evaluation_im_test_templates_id_foreign
        Schema::table('im_test', function (Blueprint $table) {
            $table->dropForeign('im_evaluation_im_test_templates_id_foreign');
            $table->foreign('im_test_templates_id')
                ->references('id')->on('im_test_templates')
                ->onDelete('cascade');
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
            $table->dropForeign('im_test_im_test_templates_id_foreign');
            $table->foreign('im_test_templates_id')
                ->references('id')->on('im_test_templates');
        });
    }
}
