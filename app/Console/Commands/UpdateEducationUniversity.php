<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\P11\P11EducationUniversity;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScriptMail;

class UpdateEducationUniversity extends Command
{
    protected $scriptTitle = "monthly update education script";
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'education-university:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the `attended_to` field inside p11_education_universities table to the date the script was run, only affecting education data that mark as still studying (untilNow = 1)';

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
        $update = P11EducationUniversity::where('untilNow', 1)->update([ 'attended_to' => date('Y-m-d') ]);
        if ($update || $update == 0) {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "The " . $this->scriptTitle . " successfully run"));
        } else {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "There is an error while running the ". $this->scriptTitle));
        }
    }
}
