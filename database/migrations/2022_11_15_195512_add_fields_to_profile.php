<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToProfile extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('paid_from')->nullable();
            $table->unsignedBigInteger('cost_center')->nullable();
            $table->string('project_task')->nullable();
            $table->unsignedInteger('supervisor_id')->nullable();
            $table->unsignedInteger('unanet_approver_id')->nullable();
            $table->string('hosting_agency')->nullable();
            $table->string('currency')->nullable();
            $table->integer('monthly_rate')->nullable();
            $table->boolean('housing')->default(0);
            $table->boolean('perdiem')->default(0);
            $table->boolean('phone')->default(0);
            $table->boolean('is_other')->default(0);
            $table->boolean('not_applicable')->default(0);
            $table->string('other')->nullable();

            $table->foreign('supervisor_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('unanet_approver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('cost_center')->references('id')->on('immap_offices')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropForeign('profiles_supervisor_id_foreign');
            $table->dropForeign('profiles_unanet_approver_id_foreign');
            $table->dropForeign('profiles_cost_center_foreign');
            $table->dropColumn('paid_from');
            $table->dropColumn('cost_center');
            $table->dropColumn('supervisor_id');
            $table->dropColumn('unanet_approver_id');
            $table->dropColumn('hosting_agency');
            $table->dropColumn('currency');
            $table->dropColumn('monthly_rate');
            $table->dropColumn('housing');
            $table->dropColumn('perdiem');
            $table->dropColumn('phone');
            $table->dropColumn('is_other');
            $table->dropColumn('not_applicable');
            $table->dropColumn('other');
            $table->dropColumn('project_task');

        });
    }
}
