<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScriptMail;

class fixEmploymentRecordDate extends Command
{
    protected $scriptTitle = "monthly fix date on employment record script";
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'employment-record:fixdate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixing corrupt date in employment record';

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
        $res = DB::update("UPDATE `p11_employment_records` SET `from`=(@temp:=`from`), `from` = `to`, `to` = @temp WHERE `from` > `to`");
        dump($res);
        if ($res || $res == 0) {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "The " . $this->scriptTitle . " successfully run"));
        } else {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "There is an error while running the ". $this->scriptTitle));
        }
    }
}
