<?php
// IC-120-add-manager-dropdown

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLineManagerIdToProfile extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('profiles')) {
            if (!Schema::hasColumn('profiles', 'line_manager_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->integer('line_manager_id')->unsigned()->nullable()->after('line_manager');
                    $table->foreign('line_manager_id')->references('id')->on('users')->onDelete('set null');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('profiles')) {
            if (Schema::hasColumn('profiles', 'line_manager_id')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->dropForeign('profiles_line_manager_id_foreign');
                    $table->dropColumn("line_manager_id");
                });
            }
        }
    }
}
