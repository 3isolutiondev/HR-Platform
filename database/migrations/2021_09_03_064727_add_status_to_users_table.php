<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddStatusToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('Not Submitted')->comment('Status of the user: [Not Submitted, Active, Inactive, Hidden]');
            $table->timestamp('hidden_date')->nullable()->comment('Date where the profile is hidden');
            $table->timestamp('schedule_deletion_date')->nullable()->comment('Date where the profile will be deleted after retention period / it is hidden');
        });

        DB::transaction(function () {
            DB::table('users')->where('p11Completed', 0)->update(['status' => 'Not Submitted']);
            DB::table('users')->where('p11Completed', 1)->update(['status' => 'Active']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('hidden_date');
            $table->dropColumn('schedule_deletion_date');
        });
    }
}
