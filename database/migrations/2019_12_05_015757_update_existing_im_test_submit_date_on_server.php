<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\Roster\ProfileRosterProcess;

class UpdateExistingImTestSubmitDateOnServer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $all = ProfileRosterProcess::all();
        foreach($all as $al) {
            if(!is_null($al->im_test_submit_date) && !is_null($al->im_test_submit_date_on_server)) {
                $date = new DateTime($al->im_test_submit_date, new DateTimeZone($al->im_test_timezone));
                $date->setTimezone(new DateTimeZone(config('app.timezone')));
                $al->im_test_submit_date_on_server = $date->format('Y-m-d H:i:s');
                $al->save();
            }
        }
        // Schema::table('profile_roster_processes', function (Blueprint $table) {
        //     DB::statement("UPDATE profile_roster_processes SET im_test_submit_date_on_server = CONVERT_TZ(`im_test_submit_date`, 'Europe\Paris', 'UTC')");
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('profile_roster_processes', function (Blueprint $table) {
        //     //
        // });
        $all = ProfileRosterProcess::all();
        foreach($all as $al) {
            if(!is_null($al->im_test_submit_date_on_server)) {
                // $date = new DateTime($al->im_test_submit_date, new DateTimeZone($al->im_test_timezone));
                // $date->setTimezone(new DateTimeZone(config('app.timezone')));
                $al->im_test_submit_date_on_server = null;
                $al->save();
            }
        }
    }
}
