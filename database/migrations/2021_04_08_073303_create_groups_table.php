<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('groups')) {
            Schema::create('groups', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('permissions')) {
            if (Schema::hasColumn('permissions', 'guard_name')) {
                if (!Schema::hasColumn('permissions', 'group_id')) {
                    Schema::table('permissions', function (Blueprint $table) {
                        $table->unsignedBigInteger('group_id')->after('guard_name')->nullable();

                        $table->foreign('group_id')->references('id')->on('groups')->onDelete('set null');
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
        if (Schema::hasColumn('permissions', 'group_id')) {
            Schema::table('permissions', function (Blueprint $table) {
                $table->dropForeign('permissions_group_id_foreign');
                $table->dropColumn('group_id');
            });
        }

        Schema::dropIfExists('groups');
    }
}
