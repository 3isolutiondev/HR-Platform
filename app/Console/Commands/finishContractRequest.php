<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class finishContractRequest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contract-request:done';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change all contract requests status to done';

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
        $updated = DB::table('job_interview_request_contracts')->update(['request_status' => 'done']);
        $this->info("{$updated} contract requests has been updated!");
    }
}
