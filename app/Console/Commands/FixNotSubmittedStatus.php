<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class FixNotSubmittedStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:not-submitted-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixing Not Submitted Users as Active bugs';

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
        $users = User::where('p11Completed', 0)->where('status', '<>', 'Not Submitted');

        $affectedUsers = $users->get();
        $updatedUsers = $users->update(['status' => 'Not Submitted']);

        $this->info($updatedUsers .' from '. count($affectedUsers). ' affected users has been fixed!');
    }
}
