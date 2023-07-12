<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\SetActiveUserMail;

class SetActiveUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'profile:set-active';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set user status as Active for p11Completed = 1';

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
        $this->info('=============== Checking and Changing for Not Submitted Bugs ===============');
        $users = User::where('p11Completed', 1)->where('status', 'Not Submitted');

        $affectedUsers = $users->get();
        $updatedUsers = $users->update(['status' => 'Active']);
        $this->info('=========== Finished Checking and Changing for Not Submitted Bugs ==========');

        $this->line('============ Start sending script report to developer mail ============');
        Mail::to(env('SCRIPT_MAIL_TO'))->send(new SetActiveUserMail($affectedUsers));
        $this->line('============ Script report has been sent to developer mail ============');

    }
}
