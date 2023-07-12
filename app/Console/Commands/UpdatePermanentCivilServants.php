<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\P11\P11PermanentCivilServant;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScriptMail;

class UpdatePermanentCivilServants extends Command
{
    protected $scriptTitle = "monthly update permanent civil servants record script";
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'civil-servants:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the `to` field inside p11_permanent_civil_servants table to the date the script was run, only affecting civil servant data that mark as still in current position (is_now = 1).';

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
        $update = P11PermanentCivilServant::where('is_now', 1)->update([ 'to' => date('Y-m-d') ]);
        if ($update || $update == 0) {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "The " . $this->scriptTitle . " successfully run"));
        } else {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "There is an error while running the ". $this->scriptTitle));
        }
    }
}
