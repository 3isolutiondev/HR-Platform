<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNestedsetToRepositoryCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('repository_category')) {
            Schema::table('repository_category', function (Blueprint $table) {
                $table->nestedSet();
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
        if (Schema::hasTable('repository_category')) {
            Schema::table('repository_category', function (Blueprint $table) {
                $table->dropNestedSet();
            });
        }
    }
}
