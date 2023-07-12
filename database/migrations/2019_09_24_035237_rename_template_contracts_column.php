<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameTemplateContractsColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_contracts', function(Blueprint $table) {
            $table->renameColumn('nama_ttd', 'name_of_ceo');
            $table->renameColumn('jabatan', 'position_of_ceo');
            $table->string('signature');

            $table->dropColumn('id_foto_ttd');
            $table->dropColumn('jabatan_user');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $table->renameColumn('name_of_ceo', 'nama_ttd');
        $table->renameColumn('position_of_ceo', 'jabatan');
        $table->string('signature');

        $table->integer('id_foto_ttd');
        $table->string('jabatan_user', 70);
    }
}
