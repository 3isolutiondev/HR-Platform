<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;

class UpdateCountryResidence extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'address:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove P11 Address and replace it with country of residence';

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
        $profiles = Profile::all();
        foreach($profiles as $profile) {
            $permanent_address = $profile->p11_addresses_permanent->first();//->permanent_country;
            if(!empty($permanent_address)) {
                $profile->fill(['country_residence_id' => $permanent_address->permanent_country])->save();
            }
        }
    }
}
