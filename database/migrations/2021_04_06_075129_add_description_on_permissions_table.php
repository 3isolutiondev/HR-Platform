<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDescriptionOnPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('permissions')) {
            if (Schema::hasColumn('permissions', 'guard_name')) {
                if (!Schema::hasColumn('permissions', 'description')) {
                    Schema::table('permissions', function (Blueprint $table) {
                        $table->text('description')->after('guard_name')->nullable();
                    });
                }
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
        if (Schema::hasTable('permissions')) {
            if (Schema::hasColumn('permissions', 'description')) {
                Schema::table('permissions', function (Blueprint $table) {
                    $table->dropColumn('description');
                });
            }
        }
    }
}
