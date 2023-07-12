<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\User;

class AddInactiveUsersHasBeenRemindedToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('inactive_user_has_been_reminded')->default('false')->comment('Is this inactive user has been reminded (value: true / false)');
            $table->timestamp('inactive_user_has_been_reminded_date')->nullable()->comment('the date when the system send inactive reminder email');
        });

        if (Schema::hasTable('users')) {
            if (Schema::hasColumn('users', 'inactive_user_has_been_reminded')) {
                DB::transaction(function () {
                    DB::table('users')
                    ->where('status', "Inactive")
                    ->where('inactive_date', '<', date('Y-m-d', strtotime('now')).' 00:00:00')
                    ->whereNotNull('inactive_date')
                    ->update([
                        'inactive_user_has_been_reminded' => 'true',
                        'inactive_user_has_been_reminded_date' => DB::raw('DATE_ADD(`inactive_date`, INTERVAL 1 DAY)')
                    ]);
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
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'inactive_user_has_been_reminded')) {
                $table->dropColumn('inactive_user_has_been_reminded');
            }
            if (Schema::hasColumn('users', 'inactive_user_has_been_reminded_date')) {
                $table->dropColumn('inactive_user_has_been_reminded_date');
            }
        });

    }
}
