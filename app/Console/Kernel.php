<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        'App\Console\Commands\UpdateSkills'
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Production Ready
        if (env('APP_ENV') == "production") {
            // Put the schedule of the script that's ready for production used

            // Backup
            $schedule->command('backup:clean')->daily()->at('00:30');
            $schedule->command('backup:run --only-db')->daily()->at('00:45');

            // Update working from and working to date
            $schedule->command('employment-record:fixdate')->monthlyOn(1, '01:30');
            $schedule->command('employment-record:update')->monthlyOn(1,'01:35');

            // Update education date
            $schedule->command('education-university:update')->monthlyOn(1, '01:40');

            // Update civil servant date
            $schedule->command('civil-servants:update')->monthlyOn(1, '01:45');

            // Check if the script can be run automatically
            if (env('ENABLED_AUTOMATIC_INCOMPLETE_PROFILE_SCRIPT') == true || env('ENABLED_AUTOMATIC_INCOMPLETE_PROFILE_SCRIPT') == 'true') {
                // Run script to delete incomplete profile in the 61st day after registration
                $schedule->command('remove-profile:incomplete-delete')->daily()->at('01:50');
                // Run script to send email reminder regarding incomplete profile after in the 31st day after registration
                $schedule->command('remove-profile:incomplete-reminder')->daily()->at('02:15');
            }

            // Update skill experience data for each user
            $schedule->command('skill:update')
                ->when(function () {
                    return \Carbon\Carbon::now()->endOfMonth()->isToday();
                })->at('02:30');
            // Update working on sector experience data for each user
            $schedule->command('sector:update')
                ->when(function () {
                    return \Carbon\Carbon::now()->endOfMonth()->isToday();
                })->at('03:30');

            // Check if the reminder and deletion inactive profile script has been enabled
            if (env('ENABLED_AUTOMATIC_DELETE_INACTIVE_USER_SCRIPT') == 'true') {
                // Remind inactive profile script
                $schedule->command('profile:inactive-reminder')->daily()->at('03:45');
                // Delete inactive profile script
                $schedule->command('profile:inactive-delete')->daily()->at('04:30');
            }

            // Check and Change User Status
            $schedule->command('profile:track-status')->daily()->at('02:45');
            // Delete hidden user script
            $schedule->command('profile:hidden-delete')->when(function () {
                return \Carbon\Carbon::now()->endOfMonth()->isToday();
            })->at('06:00');

            //Unhide all trips which the return date matches with the current week
            $schedule->command('trip:unhide-trips')->weekly()->sundays()->at('00:10');

            //Check in reminder for all trips that the travelling date matches with the current date
            $schedule->command('trip:check-in-reminder')->daily()->at('12:00');

            //Reminder iMMMAPers to fill their flight numbers for the trip
            $schedule->command('reminder:flight-number')->daily()->at('00:10');

            //Download Roster deployement excel file from microsoft oneDrive
            $schedule->command('roster:download-roster-deployment-excel-file')->daily()->at('00:45');

            //Archive all the travel requests which are older than 3 months
            $schedule->command('trip:archive')->daily()->at('00:20');
        }

        // // Staging environment
        // if (env('APP_ENV') == "staging") {
        //     // Put the schedule of the script for testing purpose on testing server
        //     $schedule->command('backup:daily')->daily()->at('05:00');
        // }

        /**
         * For local development you can put the schedule below
         * notes: Please put the schedule script on staging environment if it's ready for testing
         */

    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
