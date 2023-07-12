<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ScriptMail;

class UpdateSectors extends Command
{
    protected $scriptTitle = "monthly update profile sectors data script";
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sector:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the `years, months, and days` fields inside p11_sectors table based on employment record experience';

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
        $res = DB::update("UPDATE `p11_sectors` AS a INNER JOIN (SELECT `profile_id`, `sector_id`, MAX(`to`) AS 'max_to', MIN(`from`) AS 'min_from', (YEAR(MAX(`to`)) - YEAR(MIN(`from`))) as 'years', (TIMESTAMPDIFF(MONTH, MIN(`from`), MAX(`to`))) as 'months', (DATEDIFF(MAX(`to`), MIN(`from`))) as 'days' FROM `p11_employment_records` JOIN `p11_employment_records_sectors` ON `p11_employment_records`.`id` = `p11_employment_records_sectors`.`p11_employment_id` GROUP BY `p11_employment_records`.`profile_id`, `p11_employment_records_sectors`.`sector_id`) as b ON (a.`profile_id` = b.`profile_id` AND a.sector_id = b.sector_id) SET a.years = b.years, a.months = b.months, a.days = b.days");
        dump($res);
        if ($res || $res == 0) {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "The " . $this->scriptTitle . " successfully run"));
        } else {
            Mail::to(env("SCRIPT_MAIL_TO"))->send(new ScriptMail(env("APP_NAME") . ' - ' . ucwords($this->scriptTitle), "There is an error while running the ". $this->scriptTitle));
        }
    }
}
