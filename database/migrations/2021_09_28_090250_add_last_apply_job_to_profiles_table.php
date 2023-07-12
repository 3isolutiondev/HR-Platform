<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\User;

class AddLastApplyJobToProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('profiles', 'last_apply_job')) {
            Schema::table('profiles', function (Blueprint $table) {
                $table->timestamp('last_apply_job')->nullable();
            });

            $users = User::has('lastApplyJob')->get();

            foreach($users as $user) {
                $profile = $user->profile;
                $profile->timestamps = false;
                $profile->last_apply_job = $user->lastApplyJob->created_at;
                $profile->save();
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
        if (Schema::hasColumn('profiles', 'last_apply_job')) {
            Schema::table('profiles', function (Blueprint $table) {
                $table->dropColumn('last_apply_job');
            });
        }
    }
}
