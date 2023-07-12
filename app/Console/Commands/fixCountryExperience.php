<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;

class fixCountryExperience extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'country-experience:fix';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating working experience for each profile and country';

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
        $profiles = Profile::has('p11_employment_records')->get();

        foreach($profiles as $profile) {
            $country_experiences = $profile->p11_employment_records->pluck('country_id')->unique();

            foreach($country_experiences as $country_id) {
                $p11_employment_record_countries = $profile->p11_employment_records()->select(DB::raw('max(`to`) as max_to, min(`from`) as min_from'))->where('country_id', $country_id)->first();

                $from = date_create($p11_employment_record_countries['min_from']);
                $to = date_create($p11_employment_record_countries['max_to']);
                $interval = date_diff($to, $from);

                if (!$profile->country_of_works->contains($country_id)) {
                    $p11_country_experience_saved = $profile->country_of_works()->attach($country_id, [
                        'years' => $interval->y,
                        'months' => $interval->m + ( $interval->y * 12 ),
                        'days' => $interval->days
                    ]);
                } else {
                    $p11_country_experience_updated = $profile->country_of_works()->updateExistingPivot($country_id, [
                        'years' => $interval->y,
                        'months' => $interval->m + ( $interval->y * 12 ),
                        'days' => $interval->days
                    ]);
                }

            }
        }
    }
}
