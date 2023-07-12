<?php

namespace App\Console\Commands;

use App\Models\Profile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProfileUpdateReminderStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:update-reminder-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command is to update the status of profile update reminder';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info("Script running");
        Profile::where('updated_profile', true)->update(['updated_profile' => false]);
        $this->info('Finished');
    }
}
